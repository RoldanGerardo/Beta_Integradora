# Configuración de la Base de Datos (Microsoft SQL Server Express)

Este módulo contiene el diseño de la base de datos para el proyecto integrador.

## Requisitos
- Microsoft SQL Server Express (Instancia local).
- SQL Server Management Studio (SSMS) o la extensión de SQL Server en VS Code.

## Pasos para la instalación local:
1. Abre SQL Server Management Studio (SSMS) y conéctate a tu servidor local (usualmente `.\SQLEXPRESS`).
2. Abre el archivo `schema.sql` en una nueva consulta (New Query).
3. Ejecuta todo el script (`F5`) para crear la base de datos `beta_integradora_db` y sus tablas.

## Notas para la conexión del Backend:
- **Server/Host:** `localhost\SQLEXPRESS` o `127.0.0.1`
- **Database:** `beta_integradora_db`
- **Driver recomendado para Node.js:** `mssql` (npm package).