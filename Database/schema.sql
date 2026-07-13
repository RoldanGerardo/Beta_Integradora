IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Beta')
BEGIN
    CREATE DATABASE Beta;
END
GO

USE Beta;
GO

-- ========================================================
-- 1. USUARIO
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[USUARIO]') AND type = N'U')
BEGIN
    CREATE TABLE USUARIO (
        id_usuario INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo_electronico VARCHAR(150) NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        fecha_registro DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Columnas agregadas para soportar login por username y roles/estado
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[USUARIO]') AND name = 'username')
BEGIN
    ALTER TABLE USUARIO ADD username NVARCHAR(50) NULL;
END
GO

UPDATE USUARIO
SET username = LOWER(REPLACE(nombre, ' ', '_')) + CAST(id_usuario AS NVARCHAR(10))
WHERE username IS NULL;
GO

IF EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[USUARIO]') AND name = 'username' AND is_nullable = 1
)
BEGIN
    ALTER TABLE USUARIO ALTER COLUMN username NVARCHAR(50) NOT NULL;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.key_constraints
    WHERE name = 'UQ_USUARIO_username' AND parent_object_id = OBJECT_ID(N'[dbo].[USUARIO]')
)
BEGIN
    ALTER TABLE USUARIO ADD CONSTRAINT UQ_USUARIO_username UNIQUE (username);
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[USUARIO]') AND name = 'rol')
BEGIN
    ALTER TABLE USUARIO ADD rol NVARCHAR(20) NOT NULL DEFAULT 'usuario';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[USUARIO]') AND name = 'activo')
BEGIN
    ALTER TABLE USUARIO ADD activo BIT NOT NULL DEFAULT 1;
END
GO

-- ========================================================
-- 2. CATEGORIA
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CATEGORIA]') AND type = N'U')
BEGIN
    CREATE TABLE CATEGORIA (
        id_categoria INT IDENTITY(1,1) PRIMARY KEY,
        nombre_categoria VARCHAR(100) NOT NULL,
        descripcion VARCHAR(255) NULL
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM CATEGORIA)
BEGIN
    INSERT INTO CATEGORIA (nombre_categoria, descripcion) VALUES
    ('Becas', 'Ingresos por becas'),
    ('Mesada', 'Ingresos por mesada'),
    ('Trabajo', 'Ingresos por trabajo'),
    ('Regalos', 'Ingresos por regalos'),
    ('Ventas', 'Ingresos por ventas'),
    ('Comida', 'Gastos en comida'),
    ('Transporte', 'Gastos en transporte'),
    ('Escuela', 'Gastos escolares'),
    ('Salidas', 'Gastos en salidas'),
    ('Ropa', 'Gastos en ropa'),
    ('General', 'Categoría general');
END
GO

-- ========================================================
-- 3. MOVIMIENTO
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MOVIMIENTO]') AND type = N'U')
BEGIN
    CREATE TABLE MOVIMIENTO (
        id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_categoria INT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        tipo_movimiento VARCHAR(10) NOT NULL,
        descripcion VARCHAR(255) NULL,
        fecha_movimiento DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Movimiento_Usuario FOREIGN KEY (id_usuario)
            REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_Movimiento_Categoria FOREIGN KEY (id_categoria)
            REFERENCES CATEGORIA(id_categoria)
    );
END
GO

-- ========================================================
-- 4. MODULO_EDUCATIVO
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MODULO_EDUCATIVO]') AND type = N'U')
BEGIN
    CREATE TABLE MODULO_EDUCATIVO (
        id_modulo INT IDENTITY(1,1) PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        descripcion TEXT NULL,
        contenido_html TEXT NULL
    );
END
GO

-- ========================================================
-- 5. PROGRESO_EDUCATIVO
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PROGRESO_EDUCATIVO]') AND type = N'U')
BEGIN
    CREATE TABLE PROGRESO_EDUCATIVO (
        id_progreso INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_modulo INT NOT NULL,
        completado BIT NOT NULL DEFAULT 0,
        fecha_completado DATETIME2 NULL,
        CONSTRAINT FK_Progreso_Usuario FOREIGN KEY (id_usuario)
            REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_Progreso_Modulo FOREIGN KEY (id_modulo)
            REFERENCES MODULO_EDUCATIVO(id_modulo)
    );
END
GO

-- ========================================================
-- 6. REPORTE
-- ========================================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[REPORTE]') AND type = N'U')
BEGIN
    CREATE TABLE REPORTE (
        id_reporte INT IDENTITY(1,1) PRIMARY KEY,
        id_usuario INT NOT NULL,
        mes_reporte INT NOT NULL,
        anio_reporte INT NOT NULL,
        total_ingresos DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total_gastos DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        CONSTRAINT FK_Reporte_Usuario FOREIGN KEY (id_usuario)
            REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
    );
END
GO