-- CreateTable
CREATE TABLE `Reuniao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agendamentoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `dataReuniao` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Reuniao_agendamentoId_key`(`agendamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_agendamentoId_fkey` FOREIGN KEY (`agendamentoId`) REFERENCES `Agendamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
