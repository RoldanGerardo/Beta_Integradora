import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const verificarConexion = async () => {
  try {
    const conexion = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa a la base de datos MySQL (Beta)!');
    conexion.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
  }
};

export default pool;