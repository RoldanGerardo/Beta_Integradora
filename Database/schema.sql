-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS Beta;
USE Beta;

-- 2. Crear tabla CATEGORIA
CREATE TABLE CATEGORIA (
    id_categoria INT NOT NULL AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_CATEGORIA PRIMARY KEY (id_categoria)
);

-- 3. Crear tabla USUARIO
CREATE TABLE USUARIO (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT PK_USUARIO PRIMARY KEY (id_usuario)
);

-- 4. Crear tabla MODULO_EDUCATIVO
CREATE TABLE MODULO_EDUCATIVO (
    id_modulo INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL, 
    nivel VARCHAR(50) NOT NULL,
    CONSTRAINT PK_MODULO_EDUCATIVO PRIMARY KEY (id_modulo)
);

-- 5. Crear tabla MOVIMIENTO
CREATE TABLE MOVIMIENTO (
    id_movimiento INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_categoria INT NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    monto DECIMAL(18,2) NOT NULL,
    descripcion VARCHAR(255) NULL,
    fecha DATE NOT NULL,
    CONSTRAINT PK_MOVIMIENTO PRIMARY KEY (id_movimiento),
    CONSTRAINT FK_MOVIMIENTO_USUARIO FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT FK_MOVIMIENTO_CATEGORIA FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

-- 6. Crear tabla REPORTE
CREATE TABLE REPORTE (
    id_reporte INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_reporte VARCHAR(100) NOT NULL,
    fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_ingresos DECIMAL(18,2) NOT NULL,
    total_gastos DECIMAL(18,2) NOT NULL,
    CONSTRAINT PK_REPORTE PRIMARY KEY (id_reporte),
    CONSTRAINT FK_REPORTE_USUARIO FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- 7. Crear tabla PROGRESO_EDUCATIVO
CREATE TABLE PROGRESO_EDUCATIVO (
    id_progreso INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_modulo INT NOT NULL,
    completado BOOLEAN DEFAULT 0 NOT NULL, 
    fecha_completado DATETIME NULL,
    puntaje INT NULL,
    CONSTRAINT PK_PROGRESO_EDUCATIVO PRIMARY KEY (id_progreso),
    CONSTRAINT FK_PROGRESO_USUARIO FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT FK_PROGRESO_MODULO FOREIGN KEY (id_modulo) REFERENCES MODULO_EDUCATIVO(id_modulo)
);

INSERT INTO Beta.USUARIO (id_usuario, nombre, correo_electronico, contraseña, fecha_registro) 
VALUES (1, 'Usuario de Pruebas', 'pruebas@beta.com', '123456', NOW());