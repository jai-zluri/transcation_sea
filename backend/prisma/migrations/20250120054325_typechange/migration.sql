/*
  Warnings:

  - You are about to drop the `CSVFile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `amount` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET NOT NULL;

-- DropTable
DROP TABLE "CSVFile";
