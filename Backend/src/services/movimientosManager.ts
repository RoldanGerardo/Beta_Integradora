import pool from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class MovimientosManager {
  
  // 1. Obtener los movimientos ÚNICAMENTE del usuario autenticado
  async obtenerMovimientos(id_usuario: number): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT m.id_movimiento AS id, m.monto, m.descripcion, m.fecha, m.tipo, c.nombre_categoria AS categoria 
        FROM MOVIMIENTO m
        JOIN CATEGORIA c ON m.id_categoria = c.id_categoria
        WHERE m.id_usuario = ?
        ORDER BY m.fecha DESC
      `, [id_usuario]); // <-- Agregamos el filtro por usuario
      return rows;
    } catch (error) {
      console.error("Error al obtener movimientos de la DB:", error);
      throw error;
    }
  }

  // 2. Obtener movimientos filtrados por tipo e id_usuario
  async obtenerMovimientosPorTipo(tipo: string, id_usuario: number): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT m.id_movimiento AS id, m.monto, m.descripcion, m.fecha, m.tipo, c.nombre_categoria AS categoria 
        FROM MOVIMIENTO m
        JOIN CATEGORIA c ON m.id_categoria = c.id_categoria
        WHERE m.tipo = ? AND m.id_usuario = ?
        ORDER BY m.fecha DESC
      `, [tipo, id_usuario]); // <-- Doble filtro para asegurar privacidad
      return rows;
    } catch (error) {
      console.error("Error al obtener movimientos por tipo de la DB:", error);
      throw error;
    }
  }

  // 3. Insertar un nuevo movimiento (Este ya estaba perfecto)
  async agregarMovimiento(datos: {
    id_usuario: number;
    nombre_categoria: string;
    tipo: string;
    monto: number;
    descripcion: string;
    fecha: string;
  }): Promise<number> {
    try {
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

      const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO MOVIMIENTO (id_usuario, id_categoria, tipo, monto, descripcion, fecha) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [datos.id_usuario, id_categoria, datos.tipo, datos.monto, datos.descripcion, datos.fecha]);

      return result.insertId;
    } catch (error) {
      console.error("Error al insertar movimiento en la DB:", error);
      throw error;
    }
  }

  // 4. Eliminar un movimiento asegurando que pertenezca al usuario
  async eliminarMovimiento(id: number, id_usuario: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM MOVIMIENTO WHERE id_movimiento = ? AND id_usuario = ?", 
        [id, id_usuario] // <-- Evita que alguien borre IDs ajenos manipulando la URL
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar movimiento de la DB:", error);
      throw error;
    }
  }
  // 5. Obtener TODOS los movimientos (uso exclusivo del panel de administrador)
  async obtenerTodosLosMovimientos(): Promise<any[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT m.id_movimiento AS id, m.monto, m.descripcion, m.fecha, m.tipo, c.nombre_categoria AS categoria
        FROM MOVIMIENTO m
        JOIN CATEGORIA c ON m.id_categoria = c.id_categoria
        ORDER BY m.fecha ASC
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todos los movimientos de la DB:", error);
      throw error;
    }
  }
}

export const movimientoManager = new MovimientosManager();