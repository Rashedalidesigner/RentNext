import { prisma } from "../../lib/prisma";
import config from "../../config/config";
import { paymentStatus } from "../../../prisma/generated/prisma/enums";
import { stripe } from "../../lib/Stripte";

const periodFromDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const nextMonthPeriod = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + 1);
  return periodFromDate(date);
};

const currentPeriod = () => periodFromDate(new Date());

const getNextBillingPeriod = async (rental: { id: string; moveInDate: Date }) => {
  const lastPaid = await prisma.payment.findFirst({
    where: {
      rentalRequest_id: rental.id,
      status: paymentStatus.COMPLETED,
    },
    orderBy: { billingPeriod: "desc" },
  });

  if (!lastPaid) {
    // The initial approved rent is payable immediately. The lease start date
    // does not delay the first checkout. Subsequent payments advance one
    // calendar month from the last completed billing period.
    return currentPeriod();
  }

  return nextMonthPeriod(lastPaid.billingPeriod);
};

const createPayment = async (rentalId: string, tenantId: string) => {
  if (!rentalId) throw new Error("Rental ID is required");
  if (!tenantId) throw new Error("Tenant ID is required");

  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: { property: true },
  });

  if (!rental) throw new Error("Rental request not found");
  if (rental.tenant_id !== tenantId) throw new Error("You can only pay for your own rental request");
  if (!["APPROVED", "ACTIVE"].includes(rental.status)) {
    throw new Error("This rental is not currently payable");
  }
  if (!rental.property) throw new Error("Property not found");

  const amount = Number(rental.property.price);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid property price");

  const billingPeriod = await getNextBillingPeriod(rental);
  const todayPeriod = currentPeriod();

  if (billingPeriod > todayPeriod) {
    throw new Error(`The next rent is due in ${billingPeriod}`);
  }

  const alreadyPaid = await prisma.payment.findFirst({
    where: {
      rentalRequest_id: rental.id,
      billingPeriod,
      status: paymentStatus.COMPLETED,
    },
  });

  if (alreadyPaid) {
    throw new Error(`Rent for ${billingPeriod} has already been paid`);
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      rentalRequest_id: rental.id,
      billingPeriod,
      status: paymentStatus.PENDING,
    },
  });

  if (existingPayment?.sessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(existingPayment.sessionId);
    if (existingSession.status === "open" && existingSession.url) {
      return {
        payment: existingPayment,
        checkoutUrl: existingSession.url,
        billingPeriod,
      };
    }
  }

  const unitAmount = Math.round(amount * 100);
  const clientUrl = config.frontend_url || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "bdt",
          unit_amount: unitAmount,
          product_data: {
            name: `${rental.property.title} - Rent ${billingPeriod}`,
          },
        },
      },
    ],
    success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/payment/cancel`,
    metadata: {
      rentalId: rental.id,
      tenantId: rental.tenant_id,
      billingPeriod,
    },
  });

  if (!session.url) throw new Error("Stripe checkout URL was not generated");

  const transactionId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.id;

  const payment = await prisma.payment.create({
    data: {
      rentalRequest_id: rental.id,
      tenantId: rental.tenant_id,
      amount,
      paymentProvider: "CARD",
      status: paymentStatus.PENDING,
      sessionId: session.id,
      transaction_id: transactionId,
      customer_id: `${rental.tenant_id}-${rental.id}-${billingPeriod}`,
      billingPeriod,
    },
  });

  return { payment, checkoutUrl: session.url, billingPeriod };
};

const confirmPayment = async (sessionId: string, userId: string) => {
  if (!sessionId) throw new Error("Stripe session ID is required");
  if (!userId) throw new Error("User ID is required");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") throw new Error("Payment is not completed");

  const payment = await prisma.payment.findUnique({ where: { sessionId: session.id } });
  if (!payment) throw new Error("Payment record not found");
  if (payment.tenantId !== userId) throw new Error("You are not allowed to confirm this payment");
  if (payment.status === paymentStatus.COMPLETED) return payment;

  const rentalId = session.metadata?.rentalId;
  const metadataTenantId = session.metadata?.tenantId;
  const metadataBillingPeriod = session.metadata?.billingPeriod;

  if (rentalId && rentalId !== payment.rentalRequest_id) {
    throw new Error("Payment rental information does not match");
  }
  if (metadataTenantId && metadataTenantId !== payment.tenantId) {
    throw new Error("Payment tenant information does not match");
  }
  if (metadataBillingPeriod && metadataBillingPeriod !== payment.billingPeriod) {
    throw new Error("Payment billing period does not match");
  }

  const transactionId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : payment.transaction_id;

  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: paymentStatus.COMPLETED,
        transaction_id: transactionId,
        paidAt: payment.paidAt ?? new Date(),
      },
    });

    // First successful payment activates the lease. Monthly payments do not
    // complete/close the rental because the lease remains active.
    await tx.rentalRequest.update({
      where: { id: payment.rentalRequest_id },
      data: { status: "ACTIVE" },
    });

    return updatedPayment;
  });
};

const payments = async (tenantId: string) => {
  if (!tenantId) throw new Error("Tenant ID is required");
  return prisma.payment.findMany({
    where: { tenantId },
    orderBy: [{ billingPeriod: "desc" }, { createdAt: "desc" }],
  });
};

const payment = async (id: string, requesterId: string, requesterRole: string) => {
  if (!id) throw new Error("Payment ID is required");
  const result = await prisma.payment.findUnique({ where: { id } });
  if (!result) throw new Error("Payment not found");

  if (requesterRole !== "ADMIN" && requesterRole !== "LANDLORD" && result.tenantId !== requesterId) {
    throw new Error("You are not allowed to view this payment");
  }

  return result;
};

export const paymentservice = { createPayment, confirmPayment, payments, payment };
