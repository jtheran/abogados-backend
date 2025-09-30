/*
  Warnings:

  - A unique constraint covering the columns `[tarjetaProfesional]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documento]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documento` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tarjetaProfesional` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoDocuemnto` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Usuario] ADD [documento] NVARCHAR(1000) NOT NULL,
[tarjetaProfesional] NVARCHAR(1000) NOT NULL,
[tipoDocuemnto] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_tarjetaProfesional_key] UNIQUE NONCLUSTERED ([tarjetaProfesional]);

-- CreateIndex
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_documento_key] UNIQUE NONCLUSTERED ([documento]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
