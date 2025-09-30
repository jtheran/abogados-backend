BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000),
    [rol] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL CONSTRAINT [Usuario_estado_df] DEFAULT 1,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [Usuario_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuario_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Parte] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [tipoParte] NVARCHAR(1000) NOT NULL,
    [documentoIdentidad] NVARCHAR(1000),
    [telefono] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [direccion] NVARCHAR(1000),
    CONSTRAINT [Parte_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Juzgado] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [ciudad] NVARCHAR(1000),
    [direccion] NVARCHAR(1000),
    [telefono] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    CONSTRAINT [Juzgado_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Caso] (
    [id] NVARCHAR(1000) NOT NULL,
    [numeroRadicado] NVARCHAR(1000) NOT NULL,
    [nombreCaso] NVARCHAR(1000),
    [descripcion] NVARCHAR(1000),
    [estado] NVARCHAR(1000) NOT NULL,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Caso_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    [abogadoId] NVARCHAR(1000) NOT NULL,
    [juzgadoId] NVARCHAR(1000),
    CONSTRAINT [Caso_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Caso_numeroRadicado_key] UNIQUE NONCLUSTERED ([numeroRadicado])
);

-- CreateTable
CREATE TABLE [dbo].[CasoPartes] (
    [casoId] NVARCHAR(1000) NOT NULL,
    [parteId] NVARCHAR(1000) NOT NULL,
    [rolParte] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CasoPartes_pkey] PRIMARY KEY CLUSTERED ([casoId],[parteId])
);

-- CreateTable
CREATE TABLE [dbo].[Documento] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [rutaArchivo] NVARCHAR(1000) NOT NULL,
    [tipo] NVARCHAR(1000),
    [fechaSubida] DATETIME2 NOT NULL CONSTRAINT [Documento_fechaSubida_df] DEFAULT CURRENT_TIMESTAMP,
    [casoId] NVARCHAR(1000) NOT NULL,
    [subidoPorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Documento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Evento] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000),
    [fechaEvento] DATETIME2 NOT NULL,
    [casoId] NVARCHAR(1000) NOT NULL,
    [creadoPorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Evento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cita] (
    [id] NVARCHAR(1000) NOT NULL,
    [fechaCita] DATETIME2 NOT NULL,
    [lugar] NVARCHAR(1000),
    [descripcion] NVARCHAR(1000),
    [participantes] NVARCHAR(1000),
    [casoId] NVARCHAR(1000) NOT NULL,
    [creadoPorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Cita_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notificacion] (
    [id] NVARCHAR(1000) NOT NULL,
    [tipo] NVARCHAR(1000) NOT NULL,
    [mensaje] NVARCHAR(1000) NOT NULL,
    [estado] NVARCHAR(1000) NOT NULL CONSTRAINT [Notificacion_estado_df] DEFAULT 'Pendiente',
    [fechaEnvio] DATETIME2 NOT NULL CONSTRAINT [Notificacion_fechaEnvio_df] DEFAULT CURRENT_TIMESTAMP,
    [usuarioId] NVARCHAR(1000) NOT NULL,
    [casoId] NVARCHAR(1000),
    CONSTRAINT [Notificacion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Log] (
    [id] NVARCHAR(1000) NOT NULL,
    [nivel] NVARCHAR(1000) NOT NULL,
    [mensaje] NVARCHAR(1000) NOT NULL,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Log_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    [modulo] NVARCHAR(1000) NOT NULL,
    [usuarioId] NVARCHAR(1000),
    CONSTRAINT [Log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Caso] ADD CONSTRAINT [Caso_abogadoId_fkey] FOREIGN KEY ([abogadoId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Caso] ADD CONSTRAINT [Caso_juzgadoId_fkey] FOREIGN KEY ([juzgadoId]) REFERENCES [dbo].[Juzgado]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CasoPartes] ADD CONSTRAINT [CasoPartes_casoId_fkey] FOREIGN KEY ([casoId]) REFERENCES [dbo].[Caso]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CasoPartes] ADD CONSTRAINT [CasoPartes_parteId_fkey] FOREIGN KEY ([parteId]) REFERENCES [dbo].[Parte]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Documento] ADD CONSTRAINT [Documento_casoId_fkey] FOREIGN KEY ([casoId]) REFERENCES [dbo].[Caso]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Documento] ADD CONSTRAINT [Documento_subidoPorId_fkey] FOREIGN KEY ([subidoPorId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Evento] ADD CONSTRAINT [Evento_casoId_fkey] FOREIGN KEY ([casoId]) REFERENCES [dbo].[Caso]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Evento] ADD CONSTRAINT [Evento_creadoPorId_fkey] FOREIGN KEY ([creadoPorId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cita] ADD CONSTRAINT [Cita_casoId_fkey] FOREIGN KEY ([casoId]) REFERENCES [dbo].[Caso]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Cita] ADD CONSTRAINT [Cita_creadoPorId_fkey] FOREIGN KEY ([creadoPorId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Notificacion] ADD CONSTRAINT [Notificacion_casoId_fkey] FOREIGN KEY ([casoId]) REFERENCES [dbo].[Caso]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Log] ADD CONSTRAINT [Log_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
