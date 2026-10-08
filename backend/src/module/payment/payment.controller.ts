import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utility/CatchAsync";
import { SendResponse } from "../../utility/SendResponse";
import httpStatus from "http-status";
import { paymentservice } from "./payment.service";

const createPayment = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { rental_id } = req.body;
  const tenantId = req.user?.id;
  if (!tenantId) throw new Error("Unauthorized");

  const result = await paymentservice.createPayment(rental_id, tenantId);
  SendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment checkout created successfully", data: result });
});

const confirmPayment = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId } = req.body;
  const userId = req.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const result = await paymentservice.confirmPayment(sessionId, userId);
  SendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment confirmed successfully", data: result });
});

const getPayments = CatchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new Error("Unauthorized");

  const result = await paymentservice.payments(id);
  SendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payments retrieved successfully", data: result });
});

const getPayment = CatchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const requesterId = req.user?.id;
  const requesterRole = req.user?.role;
  if (!requesterId || !requesterRole) throw new Error("Unauthorized");

  const result = await paymentservice.payment(id, requesterId, String(requesterRole));
  SendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Payment retrieved successfully", data: result });
});

export const paymentControler = { createPayment, confirmPayment, getPayment, getPayments };
