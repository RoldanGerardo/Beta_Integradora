-- ========================================================
-- CONFIGURACIÓN INICIAL DE LA BASE DE DATOS (SQL SERVER)
-- ========================================================

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'beta_integradora_db')
BEGIN
    CREATE DATABASE beta_integradora_db;
END
GO

USE beta_integradora_db;
GO

-- 1. Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Tabla para Simulación de Gastos / Presupuestos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[presupuestos]') AND type in (N'U'))
BEGIN
    CREATE TABLE presupuestos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT,
        monto_limite DECIMAL(10,2) NOT NULL,
        categoria NVARCHAR(50) NOT NULL,
        mes_anio NVARCHAR(7) NOT NULL, -- Formato: '2026-06'
        CONSTRAINT FK_Presupuestos_Usuarios FOREIGN KEY (usuario_id) 
            REFERENCES usuarios(id) ON DELETE CASCADE
    );
END
GO