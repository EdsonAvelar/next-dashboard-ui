/*
  Warnings:

  - You are about to alter the column `dataProposta` on the `simulacao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `conCredito` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conAdesao` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conEntrada` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conParcelaCheia` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conParcelaReduzida` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conLance` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conCreditoPosContemplacao` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conRendaExigida` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conValorPago` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `conJurosPagos` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finUltimaParcela` on the `simulacaoconsorcio` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finCredito` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finEntrada` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finParcelas` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finUltimaParcela` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finRendaExigida` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finCartorio` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finJurosPagos` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - You are about to alter the column `finValPagoTotal` on the `simulacaofinanciamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(10,2)`.
  - Made the column `conPrazo` on table `simulacaoconsorcio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conParcelasEmbutidas` on table `simulacaoconsorcio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finPrazo` on table `simulacaofinanciamento` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `simulacao` MODIFY `dataProposta` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `simulacaoconsorcio` MODIFY `conCredito` DECIMAL(10, 2) NULL,
    MODIFY `conAdesao` DECIMAL(10, 2) NULL,
    MODIFY `conEntrada` DECIMAL(10, 2) NULL,
    MODIFY `conParcelaCheia` DECIMAL(10, 2) NULL,
    MODIFY `conParcelaReduzida` DECIMAL(10, 2) NULL,
    MODIFY `conLance` DECIMAL(10, 2) NULL,
    MODIFY `conPrazo` INTEGER NOT NULL,
    MODIFY `conCreditoPosContemplacao` DECIMAL(10, 2) NULL,
    MODIFY `conRendaExigida` DECIMAL(10, 2) NULL,
    MODIFY `conValorPago` DECIMAL(10, 2) NULL,
    MODIFY `conJurosPagos` DECIMAL(10, 2) NULL,
    MODIFY `finUltimaParcela` DECIMAL(10, 2) NULL,
    MODIFY `conParcelasEmbutidas` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `simulacaofinanciamento` MODIFY `finCredito` DECIMAL(10, 2) NULL,
    MODIFY `finEntrada` DECIMAL(10, 2) NULL,
    MODIFY `finParcelas` DECIMAL(10, 2) NULL,
    MODIFY `finUltimaParcela` DECIMAL(10, 2) NULL,
    MODIFY `finPrazo` INTEGER NOT NULL,
    MODIFY `finRendaExigida` DECIMAL(10, 2) NULL,
    MODIFY `finCartorio` DECIMAL(10, 2) NULL,
    MODIFY `finJurosPagos` DECIMAL(10, 2) NULL,
    MODIFY `finValPagoTotal` DECIMAL(10, 2) NULL;
