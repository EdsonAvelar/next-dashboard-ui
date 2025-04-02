-- CreateTable
CREATE TABLE `Tenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('MASTER', 'SUBMASTER', 'REPRESENTATION') NOT NULL,
    `billingFrequency` ENUM('MENSAL', 'TRIMESTRAL', 'ANUAL') NOT NULL,
    `submasterId` INTEGER NULL,
    `indicatedById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Billing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `plan` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Billing_tenantId_key`(`tenantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cargo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `rg` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `data_contratacao` VARCHAR(191) NULL,
    `data_demissao` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified_at` DATETIME(3) NULL,
    `password` VARCHAR(191) NOT NULL,
    `cargoId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `equipeId` INTEGER NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `liderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `Equipe_liderId_key`(`liderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Negocio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NULL,
    `origem` VARCHAR(191) NULL,
    `tipo` ENUM('IMOVEL', 'CARRO', 'MOTO', 'CAMINHAO', 'TERRENO', 'MAQUINARIO', 'SERVICO') NOT NULL,
    `status` ENUM('ATIVO', 'INATIVO', 'VENDIDO', 'PERDIDO') NOT NULL,
    `consorciado_id` INTEGER NOT NULL,
    `conjugeId` INTEGER NULL,
    `funil_id` INTEGER NOT NULL,
    `etapa_funil_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `Negocio_conjugeId_key`(`conjugeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(254) NOT NULL,
    `telefone` VARCHAR(32) NOT NULL,
    `whatsapp` VARCHAR(32) NULL,
    `email` VARCHAR(254) NULL,
    `nome_mae` VARCHAR(255) NULL,
    `nome_pai` VARCHAR(255) NULL,
    `data_nasc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orgao_exp` VARCHAR(255) NULL,
    `cpf` VARCHAR(255) NULL,
    `rg` VARCHAR(255) NULL,
    `data_exp` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nacionalidade` VARCHAR(255) NULL,
    `naturalidade` VARCHAR(255) NULL,
    `genero` VARCHAR(255) NULL,
    `estado_civil` VARCHAR(255) NULL,
    `formacao` VARCHAR(255) NULL,
    `profissao` VARCHAR(255) NULL,
    `renda_liquida` VARCHAR(255) NULL,
    `data_conversao` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fonte` VARCHAR(254) NULL,
    `campanha` VARCHAR(254) NULL,
    `endereco` VARCHAR(254) NULL,
    `numero` VARCHAR(254) NULL,
    `bairro` VARCHAR(254) NULL,
    `cidade` VARCHAR(254) NULL,
    `estado` VARCHAR(254) NULL,
    `complemento` VARCHAR(254) NULL,
    `cep` VARCHAR(254) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtapaFunil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `tipo` ENUM('COMUM', 'REUNIAO', 'AGENDAMENTO', 'FECHAMENTO') NOT NULL,
    `ordem` INTEGER NOT NULL,
    `funil_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

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
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reuniao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dataReuniao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `agendamentoId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `Reuniao_agendamentoId_key`(`agendamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aprovacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_aprovacao` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `negocioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fechamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_fechamento` DATETIME(3) NULL,
    `status` VARCHAR(255) NULL,
    `grupo` VARCHAR(255) NULL,
    `cota` VARCHAR(255) NULL,
    `especie` VARCHAR(255) NULL,
    `marca` VARCHAR(255) NULL,
    `modelo` VARCHAR(255) NULL,
    `tipo_plano` VARCHAR(255) NULL,
    `plano_leve` VARCHAR(255) NULL,
    `seguro_prestamista` VARCHAR(255) NULL,
    `codigo_bem` VARCHAR(255) NULL,
    `preco_bem` DECIMAL(10, 2) NULL,
    `duracao_grupo` INTEGER NULL,
    `duracao_plano` INTEGER NULL,
    `grupo_em_formacao` BOOLEAN NULL,
    `grupo_em_andamento` BOOLEAN NULL,
    `numero_assembleia_adesao` INTEGER NULL,
    `data_assembleia` DATETIME(3) NULL,
    `tabela` VARCHAR(255) NULL,
    `pagamento_incorporado` DECIMAL(10, 2) NULL,
    `pagamento_ate_contemplacao` DECIMAL(10, 2) NULL,
    `numero_contrato` INTEGER NULL,
    `parcela` DECIMAL(10, 2) NULL,
    `parcela_antecipada` DECIMAL(10, 2) NULL,
    `total_antecipado` DECIMAL(10, 2) NULL,
    `adesao` DECIMAL(10, 2) NULL,
    `primeira_parcela` DECIMAL(10, 2) NULL,
    `total_pago` DECIMAL(10, 2) NULL,
    `forma_pagamento` VARCHAR(255) NULL,
    `negocioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `Fechamento_negocioId_key`(`negocioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FechamentoUser` (
    `fechamentoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `comissao` VARCHAR(10) NULL,
    `modo` VARCHAR(255) NULL,

    PRIMARY KEY (`fechamentoId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Simulacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NULL,
    `dataProposta` DATETIME(3) NULL,
    `negocioId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SimulacaoConsorcio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conTitulo` VARCHAR(191) NULL,
    `conEmpresa` VARCHAR(191) NULL,
    `conCredito` DECIMAL(10, 2) NULL,
    `conAdesao` DECIMAL(10, 2) NULL,
    `conEntrada` DECIMAL(10, 2) NULL,
    `conParcelaCheia` DECIMAL(10, 2) NULL,
    `conParcelaReduzida` DECIMAL(10, 2) NULL,
    `conLance` DECIMAL(10, 2) NULL,
    `conPrazo` INTEGER NOT NULL,
    `conCreditoPosContemplacao` DECIMAL(10, 2) NULL,
    `conRendaExigida` DECIMAL(10, 2) NULL,
    `conValorPago` DECIMAL(10, 2) NULL,
    `conJurosPagos` DECIMAL(10, 2) NULL,
    `conParcelasEmbutidas` INTEGER NOT NULL,
    `simulacaoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SimulacaoFinanciamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `finTitulo` VARCHAR(191) NULL,
    `finAmortizacao` VARCHAR(191) NULL,
    `finEmpresa` VARCHAR(191) NULL,
    `finCredito` DECIMAL(10, 2) NULL,
    `finEntrada` DECIMAL(10, 2) NULL,
    `finParcelas` DECIMAL(10, 2) NULL,
    `finUltimaParcela` DECIMAL(10, 2) NULL,
    `finPrazo` INTEGER NOT NULL,
    `finRendaExigida` DECIMAL(10, 2) NULL,
    `finCartorio` DECIMAL(10, 2) NULL,
    `finJurosPagos` DECIMAL(10, 2) NULL,
    `finValPagoTotal` DECIMAL(10, 2) NULL,
    `simulacaoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tenantId` INTEGER NOT NULL,

    UNIQUE INDEX `Config_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoleToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoleToUser_AB_unique`(`A`, `B`),
    INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LabelToNegocio` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LabelToNegocio_AB_unique`(`A`, `B`),
    INDEX `_LabelToNegocio_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tenant` ADD CONSTRAINT `Tenant_submasterId_fkey` FOREIGN KEY (`submasterId`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tenant` ADD CONSTRAINT `Tenant_indicatedById_fkey` FOREIGN KEY (`indicatedById`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Billing` ADD CONSTRAINT `Billing_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cargoId_fkey` FOREIGN KEY (`cargoId`) REFERENCES `Cargo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `Equipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipe` ADD CONSTRAINT `Equipe_liderId_fkey` FOREIGN KEY (`liderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipe` ADD CONSTRAINT `Equipe_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_consorciado_id_fkey` FOREIGN KEY (`consorciado_id`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_conjugeId_fkey` FOREIGN KEY (`conjugeId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_funil_id_fkey` FOREIGN KEY (`funil_id`) REFERENCES `Funil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_etapa_funil_id_fkey` FOREIGN KEY (`etapa_funil_id`) REFERENCES `EtapaFunil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Negocio` ADD CONSTRAINT `Negocio_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funil` ADD CONSTRAINT `Funil_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFunil` ADD CONSTRAINT `EtapaFunil_funil_id_fkey` FOREIGN KEY (`funil_id`) REFERENCES `Funil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFunil` ADD CONSTRAINT `EtapaFunil_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_agendamentoId_fkey` FOREIGN KEY (`agendamentoId`) REFERENCES `Agendamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aprovacao` ADD CONSTRAINT `Aprovacao_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aprovacao` ADD CONSTRAINT `Aprovacao_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fechamento` ADD CONSTRAINT `Fechamento_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fechamento` ADD CONSTRAINT `Fechamento_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FechamentoUser` ADD CONSTRAINT `FechamentoUser_fechamentoId_fkey` FOREIGN KEY (`fechamentoId`) REFERENCES `Fechamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FechamentoUser` ADD CONSTRAINT `FechamentoUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producao` ADD CONSTRAINT `Producao_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulacao` ADD CONSTRAINT `Simulacao_negocioId_fkey` FOREIGN KEY (`negocioId`) REFERENCES `Negocio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulacao` ADD CONSTRAINT `Simulacao_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulacao` ADD CONSTRAINT `Simulacao_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SimulacaoConsorcio` ADD CONSTRAINT `SimulacaoConsorcio_simulacaoId_fkey` FOREIGN KEY (`simulacaoId`) REFERENCES `Simulacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SimulacaoFinanciamento` ADD CONSTRAINT `SimulacaoFinanciamento_simulacaoId_fkey` FOREIGN KEY (`simulacaoId`) REFERENCES `Simulacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Config` ADD CONSTRAINT `Config_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LabelToNegocio` ADD CONSTRAINT `_LabelToNegocio_A_fkey` FOREIGN KEY (`A`) REFERENCES `Label`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LabelToNegocio` ADD CONSTRAINT `_LabelToNegocio_B_fkey` FOREIGN KEY (`B`) REFERENCES `Negocio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
