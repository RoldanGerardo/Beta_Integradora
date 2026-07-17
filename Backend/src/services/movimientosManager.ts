import pool from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class MovimientosManager {
  
  // 1. Obtener todos los movimientos con su nombre de categoría
  async obtenerMovimientos(): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT m.id_movimiento AS id, m.monto, m.descripcion, m.fecha, m.tipo, c.nombre_categoria AS categoria 
        FROM MOVIMIENTO m
        JOIN CATEGORIA c ON m.id_categoria = c.id_categoria
        ORDER BY m.fecha DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener movimientos de la DB:", error);
      throw error;
    }
  }

  // 2. Obtener movimientos filtrados por tipo ('ingreso' o 'egreso')
  async obtenerMovimientosPorTipo(tipo: string): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT m.id_movimiento AS id, m.monto, m.descripcion, m.fecha, m.tipo, c.nombre_categoria AS categoria 
        FROM MOVIMIENTO m
        JOIN CATEGORIA c ON m.id_categoria = c.id_categoria
        WHERE m.tipo = ?
        ORDER BY m.fecha DESC
      `, [tipo]);
      return rows;
    } catch (error) {
      console.error("Error al obtener movimientos por tipo de la DB:", error);
      throw error;
    }
  }

  // 3. Insertar un nuevo movimiento
  async agregarMovimiento(datos: {
    id_usuario: number;
    nombre_categoria: string;
    tipo: string;
    monto: number;
    descripcion: string;
    fecha: string;
  }): Promise<number> {
    try {
      // A. Buscar si existe la categoría, si no, la creamos dinámicamente
      let [categoria] = await pool.query<RowDataPacket[]>(
        "SELECT id_categoria FROM CATEGORIA WHERE nombre_categoria = ?", 
        [datos.nombre_categoria]
      );

      let id_categoria: number;

      if (categoria.length === 0) {
        const [insertCat] = await pool.query<ResultSetHeader>(
          "INSERT INTO CATEGORIA (nombre_categoria) VALUES (?)",
          [datos.nombre_categoria]
        );
        id_categoria = insertCat.insertId;
      } else {
        id_categoria = categoria[0].id_categoria;
      }

      // B. Insertar el movimiento en la tabla
      const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO MOVIMIENTO (id_usuario, id_categoria, tipo, monto, descripcion, fecha) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [datos.id_usuario, id_categoria, datos.tipo, datos.monto, datos.descripcion, datos.fecha]);

      return result.insertId; // Retorna el ID autogenerado por MySQL
    } catch (error) {
      console.error("Error al insertar movimiento en la DB:", error);
      throw error;
    }
  }

  // 4. Eliminar un movimiento por su ID
  async eliminarMovimiento(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM MOVIMIENTO WHERE id_movimiento = ?", 
        [id]
      );
      return result.affectedRows > 0; // Retorna true si eliminó algo
    } catch (error) {
      console.error("Error al eliminar movimiento de la DB:", error);
      throw error;
    }
  }
}

// Exportamos una única instancia del manager
export const movimientoManager = new MovimientosManager();