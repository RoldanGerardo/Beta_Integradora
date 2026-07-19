import pool from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import Usuario, { RolUsuario } from "../models/Usuario.js";
import { hashPassword } from "./authService.js";
import {
  esAdmin,
  marcarComoAdmin,
  quitarAdmin,
  estaActivo,
  establecerActivo,
  eliminarRegistro,
} from "./rolesStore.js";

export class UsuarioManager {
  // 1. Obtener todos los usuarios de la base de datos
  async obtenerTodos(): Promise<Usuario[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña, fecha_registro FROM USUARIO"
      );
      return rows.map((r) => this.mapearFila(r));
    } catch (error) {
      console.error("Error al obtener usuarios de la DB:", error);
      throw error;
    }
  }

  // 2. Obtener un usuario por su ID
  async obtenerPorId(id: number): Promise<Usuario | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña, fecha_registro FROM USUARIO WHERE id_usuario = ?",
        [id]
      );
      if (rows.length === 0) return null;
      return this.mapearFila(rows[0]);
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  }

  // 3. Buscar usuario para el Login (por correo electrónico)
  async obtenerPorEmailOUsername(identificador: string): Promise<Usuario | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña, fecha_registro FROM USUARIO WHERE correo_electronico = ?",
        [identificador]
      );
      if (rows.length === 0) return null;
      return this.mapearFila(rows[0]);
    } catch (error) {
      console.error("Error al obtener usuario por correo:", error);
      throw error;
    }
  }

  // 4. Agregar / Registrar un nuevo usuario de forma segura.
  // La tabla USUARIO no tiene columna "rol", así que si se pide crear
  // un administrador, esa condición se guarda en roles-store.json
  // (fuera de la BD, tal como se pidió no modificar su estructura).
  async agregarUsuario(
    nombre: string,
    username: string,
    email: string,
    passwordPlana: string,
    rol: RolUsuario = "usuario"
  ): Promise<Usuario> {
    try {
      const existente = await this.obtenerPorEmailOUsername(email);
      if (existente) {
        throw new Error("El correo electrónico ya está registrado.");
      }

      const passwordEncriptada = hashPassword(passwordPlana);

      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO USUARIO (nombre, correo_electronico, contraseña) VALUES (?, ?, ?)",
        [nombre, email, passwordEncriptada]
      );

      const nuevoId = result.insertId;
      if (rol === "admin") {
        marcarComoAdmin(email);
      }

      return new Usuario(nuevoId, nombre, username || nombre, email, passwordEncriptada, rol, true);
    } catch (error) {
      console.error("Error al registrar usuario en la DB:", error);
      throw error;
    }
  }

  // 5. Actualizar datos de un usuario (nombre, correo, rol, estado).
  // "username" y "rol"/"activo" no viven en columnas de USUARIO: el
  // nombre se actualiza en la BD, y rol/activo en el store externo.
  async actualizarUsuario(
    id: number,
    datos: Partial<{ nombre: string; username: string; email: string; rol: RolUsuario; activo: boolean }>
  ): Promise<Usuario | null> {
    try {
      const actual = await this.obtenerPorId(id);
      if (!actual) return null;

      const campos: string[] = [];
      const valores: any[] = [];

      if (datos.nombre !== undefined) { campos.push("nombre = ?"); valores.push(datos.nombre); }
      if (datos.email !== undefined) { campos.push("correo_electronico = ?"); valores.push(datos.email); }

      if (campos.length > 0) {
        valores.push(id);
        await pool.query<ResultSetHeader>(
          `UPDATE USUARIO SET ${campos.join(", ")} WHERE id_usuario = ?`,
          valores
        );
      }

      const correoFinal = datos.email ?? actual.getEmail();

      if (datos.rol !== undefined) {
        if (datos.rol === "admin") marcarComoAdmin(correoFinal);
        else quitarAdmin(correoFinal);
      }

      if (datos.activo !== undefined) {
        establecerActivo(id, datos.activo);
      }

      return this.obtenerPorId(id);
    } catch (error) {
      console.error("Error al actualizar usuario en la DB:", error);
      throw error;
    }
  }

  // 6. Eliminar un usuario de la BD
  async eliminarUsuario(id: number): Promise<boolean> {
    try {
      const actual = await this.obtenerPorId(id);
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM USUARIO WHERE id_usuario = ?",
        [id]
      );
      if (result.affectedRows > 0 && actual) {
        eliminarRegistro(id, actual.getEmail());
      }
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar usuario de la DB:", error);
      throw error;
    }
  }

  // Convierte una fila de MySQL en una instancia de Usuario, combinando
  // los datos reales de la BD con el rol/estado guardados en el store.
  private mapearFila(r: RowDataPacket): Usuario {
    const rol: RolUsuario = esAdmin(r.correo_electronico) ? "admin" : "usuario";
    const activo = estaActivo(r.id_usuario);
    return new Usuario(
      r.id_usuario,
      r.nombre,
      r.nombre, // no existe columna username; se usa el nombre como antes
      r.correo_electronico,
      r.contraseña,
      rol,
      activo,
      r.fecha_registro
    );
  }
}

export const usuarioManager = new UsuarioManager();

// Crea (o marca como admin) un administrador inicial, sin alterar la
// estructura de la tabla USUARIO: la fila se inserta con las columnas
// normales y el rol "admin" se guarda en roles-store.json.
export async function asegurarAdminInicial(): Promise<void> {
  try {
    const existente = await usuarioManager.obtenerPorEmailOUsername("admin@beta.com");
    if (existente) {
      marcarComoAdmin("admin@beta.com");
      return;
    }
    await usuarioManager.agregarUsuario(
      "Administrador BETA",
      "admin",
      "admin@beta.com",
      "Admin123!",
      "admin"
    );
    console.log("✅ Administrador inicial creado -> admin@beta.com / Admin123!");
  } catch (error) {
    console.error("❌ No se pudo verificar/crear el administrador inicial:", error);
  }
}