/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `CSVFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- -- AlterTable
-- ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- -- DropTable
-- DROP TABLE "CSVFile";

-- Rename the existing column
ALTER TABLE "Transaction" RENAME COLUMN "amount" TO "amount_old";

-- Add the new Decimal column
ALTER TABLE "Transaction" ADD COLUMN "amount" NUMERIC(65,30);

-- Migrate data from the old column to the new Decimal column
UPDATE "Transaction" SET "amount" = "amount_old"::NUMERIC(65,30);

-- Drop the old column
ALTER TABLE "Transaction" DROP COLUMN "amount_old";

