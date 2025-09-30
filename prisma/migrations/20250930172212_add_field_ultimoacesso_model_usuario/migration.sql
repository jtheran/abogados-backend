/*
  Warnings:

  - You are about to drop the column `tipoDocuemnto` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `tipoDocumento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Usuario] DROP COLUMN [tipoDocuemnto];
ALTER TABLE [dbo].[Usuario] ADD [tipoDocumento] NVARCHAR(1000) NOT NULL,
[ultimoAcceso] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
