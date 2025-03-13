/*
  Warnings:

  - You are about to alter the column `modo` on the `fechamentouser` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `fechamentouser` MODIFY `modo` VARCHAR(255) NULL;
