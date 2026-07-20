import pool from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import Articulo from "../models/Articulo.js";

interface FilaArticulo extends RowDataPacket {
    id_modulo: number;
    titulo: string;
    contenido: string;
    fecha: string;
    categoria: string;
    autor: string;
    resumen: string;
    tiempo_lectura: number;
    tags: string | null;
    destacado: number;
    imagen: string | null;
}

export class EducativoManager {
    private mapearFila(r: FilaArticulo): Articulo {
        const tags = r.tags ? r.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
        return new Articulo(
            r.id_modulo,
            r.titulo,
            r.contenido,
            r.fecha,
            r.categoria,
            r.autor,
            r.resumen,
            r.tiempo_lectura,
            tags,
            !!r.destacado,
            r.imagen ?? ""
        );
    }

    async obtenerArticulos(): Promise<Articulo[]> {
        try {
            const [rows] = await pool.query<FilaArticulo[]>(
                "SELECT * FROM MODULO_EDUCATIVO ORDER BY id_modulo DESC"
            );
            return rows.map((r) => this.mapearFila(r));
        } catch (error) {
            console.error("Error al obtener artículos de la DB:", error);
            throw error;
        }
    }

    async obtenerArticuloPorId(id: number): Promise<Articulo | null> {
        try {
            const [rows] = await pool.query<FilaArticulo[]>(
                "SELECT * FROM MODULO_EDUCATIVO WHERE id_modulo = ?",
                [id]
            );
            if (rows.length === 0) return null;
            return this.mapearFila(rows[0]);
        } catch (error) {
            console.error("Error al obtener artículo por ID:", error);
            throw error;
        }
    }

    async agregarArticulo(datos: {
        titulo: string;
        contenido: string;
        fecha: string;
        categoria?: string;
        autor?: string;
        resumen?: string;
        tiempoLectura?: number;
        tags?: string[];
        destacado?: boolean;
        imagen?: string;
    }): Promise<Articulo> {
        try {
            const resumen =
                datos.resumen && datos.resumen.length > 0
                    ? datos.resumen
                    : datos.contenido.slice(0, 140).trim() + "...";

            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO MODULO_EDUCATIVO
                    (titulo, contenido, fecha, categoria, autor, resumen, tiempo_lectura, tags, destacado, imagen)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    datos.titulo,
                    datos.contenido,
                    datos.fecha,
                    datos.categoria ?? "Educación financiera",
                    datos.autor ?? "Equipo BETA",
                    resumen,
                    datos.tiempoLectura ?? 4,
                    (datos.tags ?? []).join(","),
                    datos.destacado ? 1 : 0,
                    datos.imagen ?? "",
                ]
            );

            const nuevo = await this.obtenerArticuloPorId(result.insertId);
            return nuevo!;
        } catch (error) {
            console.error("Error al insertar artículo en la DB:", error);
            throw error;
        }
    }

    async actualizarArticulo(
        id: number,
        datos: Partial<{
            titulo: string;
            contenido: string;
            fecha: string;
            categoria: string;
            autor: string;
            resumen: string;
            tiempoLectura: number;
            tags: string[];
            destacado: boolean;
            imagen: string;
        }>
    ): Promise<Articulo | null> {
        try {
            const actual = await this.obtenerArticuloPorId(id);
            if (!actual) return null;

            const campos: string[] = [];
            const valores: any[] = [];

            if (datos.titulo !== undefined) { campos.push("titulo = ?"); valores.push(datos.titulo); }
            if (datos.contenido !== undefined) { campos.push("contenido = ?"); valores.push(datos.contenido); }
            if (datos.fecha !== undefined) { campos.push("fecha = ?"); valores.push(datos.fecha); }
            if (datos.categoria !== undefined) { campos.push("categoria = ?"); valores.push(datos.categoria); }
            if (datos.autor !== undefined) { campos.push("autor = ?"); valores.push(datos.autor); }
            if (datos.resumen !== undefined) { campos.push("resumen = ?"); valores.push(datos.resumen); }
            if (datos.tiempoLectura !== undefined) { campos.push("tiempo_lectura = ?"); valores.push(datos.tiempoLectura); }
            if (datos.tags !== undefined) { campos.push("tags = ?"); valores.push(datos.tags.join(",")); }
            if (datos.destacado !== undefined) { campos.push("destacado = ?"); valores.push(datos.destacado ? 1 : 0); }
            if (datos.imagen !== undefined) { campos.push("imagen = ?"); valores.push(datos.imagen); }

            if (campos.length > 0) {
                valores.push(id);
                await pool.query<ResultSetHeader>(
                    `UPDATE MODULO_EDUCATIVO SET ${campos.join(", ")} WHERE id_modulo = ?`,
                    valores
                );
            }

            return this.obtenerArticuloPorId(id);
        } catch (error) {
            console.error("Error al actualizar artículo en la DB:", error);
            throw error;
        }
    }

    async eliminarArticulo(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                "DELETE FROM MODULO_EDUCATIVO WHERE id_modulo = ?",
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error al eliminar artículo de la DB:", error);
            throw error;
        }
    }
}

export const educativoManager = new EducativoManager();