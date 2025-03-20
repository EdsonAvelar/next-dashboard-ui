/*
  Warnings:

  - You are about to drop the column `userId` on the `aprovacao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `aprovacao` DROP FOREIGN KEY `Aprovacao_userId_fkey`;

-- DropIndex
DROP INDEX `Aprovacao_userId_fkey` ON `aprovacao`;

-- AlterTable
ALTER TABLE `aprovacao` DROP COLUMN `userId`;
