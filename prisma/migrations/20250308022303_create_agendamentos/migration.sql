-- AlterTable
ALTER TABLE `user` MODIFY `avatar` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agendamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataAgendado` DATETIME(3) NOT NULL,
    `dataAgendamento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hora` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `negocioId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LabelToNegocio` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LabelToNegocio_AB_unique`(`A`, `B`),
    INDEX `_LabelToNegocio_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LabelToNegocio` ADD CONSTRAINT `_LabelToNegocio_A_fkey` FOREIGN KEY (`A`) REFERENCES `Label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LabelToNegocio` ADD CONSTRAINT `_LabelToNegocio_B_fkey` FOREIGN KEY (`B`) REFERENCES `Negocio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
