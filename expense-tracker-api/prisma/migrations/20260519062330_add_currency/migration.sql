/*
  Warnings:

  - Made the column `category` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ALTER COLUMN "category" SET NOT NULL;
