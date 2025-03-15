-- CreateTable
CREATE TABLE `Simulacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NULL,
    `dataProposta` VARCHAR(191) NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SimulacaoConsorcio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conTitulo` VARCHAR(191) NULL,
    `conEmpresa` VARCHAR(191) NULL,
    `conCredito` VARCHAR(191) NULL,
    `conAdesao` VARCHAR(191) NULL,
    `conEntrada` VARCHAR(191) NULL,
    `conParcelaCheia` VARCHAR(191) NULL,
    `conParcelaReduzida` VARCHAR(191) NULL,
    `conLance` VARCHAR(191) NULL,
    `conPrazo` VARCHAR(191) NULL,
    `conCreditoPosContemplacao` VARCHAR(191) NULL,
    `conRendaExigida` VARCHAR(191) NULL,
    `conValorPago` VARCHAR(191) NULL,
    `conJurosPagos` VARCHAR(191) NULL,
    `finUltimaParcela` VARCHAR(191) NULL,
    `conParcelasEmbutidas` VARCHAR(191) NULL,
    `simulacaoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SimulacaoFinanciamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `finTitulo` VARCHAR(191) NULL,
    `finAmortizacao` VARCHAR(191) NULL,
    `finEmpresa` VARCHAR(191) NULL,
    `finCredito` VARCHAR(191) NULL,
    `finEntrada` VARCHAR(191) NULL,
    `finParcelas` VARCHAR(191) NULL,
    `finUltimaParcela` VARCHAR(191) NULL,
    `finPrazo` VARCHAR(191) NULL,
    `finRendaExigida` VARCHAR(191) NULL,
    `finCartorio` VARCHAR(191) NULL,
    `finJurosPagos` VARCHAR(191) NULL,
    `finValPagoTotal` VARCHAR(191) NULL,
    `simulacaoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Simulacao` ADD CONSTRAINT `Simulacao_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulacao` ADD CONSTRAINT `Simulacao_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SimulacaoConsorcio` ADD CONSTRAINT `SimulacaoConsorcio_simulacaoId_fkey` FOREIGN KEY (`simulacaoId`) REFERENCES `Simulacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SimulacaoFinanciamento` ADD CONSTRAINT `SimulacaoFinanciamento_simulacaoId_fkey` FOREIGN KEY (`simulacaoId`) REFERENCES `Simulacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
