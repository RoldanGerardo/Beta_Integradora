// Backend/src/config/db.ts
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER || 'sa', // Tu usuario de SQL Server (comúnmente sa)
    password: process.env.DB_PASSWORD || 'Betaintegradora123', // Tu contraseña de SSMS
    server: process.env.DB_SERVER || 'localhost', // Si usas instancia: 'localhost\\SQLEXPRESS'
    database: process.env.DB_DATABASE || 'Beta',
    options: {
        encrypt: false, // Poner en true si estás en Azure o lo requiere tu servidor
        trustServerCertificate: true // Crucial para que no falle la conexión en local (localhost)
    }
};

export async function conectarDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("⚡ Conexión exitosa a Microsoft SQL Server Express");
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar a la Base de Datos:", error);
        throw error;
    }
}

export { sql };
export { conectarDB as getPool };