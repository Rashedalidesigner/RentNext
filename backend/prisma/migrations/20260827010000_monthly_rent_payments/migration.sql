-- Allow multiple payments for the same rental request, one per billing month.
DROP INDEX IF EXISTS "Payment_rentalRequest_id_key";
DROP INDEX IF EXISTS "Payment_customer_id_key";

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "billingPeriod" TEXT;

-- Backfill existing payments to the month in which they were paid/created.
UPDATE "Payment"
SET "billingPeriod" = TO_CHAR(COALESCE("paidAt", "createdAt"), 'YYYY-MM')
WHERE "billingPeriod" IS NULL;

ALTER TABLE "Payment" ALTER COLUMN "billingPeriod" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_rentalRequest_id_billingPeriod_key"
ON "Payment"("rentalRequest_id", "billingPeriod");

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_sessionId_key" ON "Payment"("sessionId");
