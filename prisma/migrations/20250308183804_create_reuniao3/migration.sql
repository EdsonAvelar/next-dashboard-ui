/*
  Warnings:

  - You are about to alter the column `dataReuniao` on the `reuniao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `reuniao` MODIFY `dataReuniao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
