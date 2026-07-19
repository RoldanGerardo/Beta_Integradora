import pool from "../config/db.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import Usuario, { RolUsuario } from "../models/Usuario.js";
import { hashPassword } from "./authService.js";

export class UsuarioManager {

  // 1. Obtener todos los usuarios de la base de datos
  async obtenerTodos(): Promise<Usuario[]> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña, fecha_registro FROM USUARIO"
      );
      
      return rows.map(r => new Usuario(
        r.id_usuario,
        r.nombre,
        r.nombre, // Usamos el nombre como username por compatibilidad
        r.correo_electronico,
        r.contraseña,
        "usuario", // Rol por defecto, se puede ampliar según tus necesidades
        true,
        r.fecha_registro
      ));
    } catch (error) {
      console.error("Error al obtener usuarios de la DB:", error);
      throw error;
    }
  }

// 2. Obtener un usuario por su ID
  async obtenerPorId(id: number): Promise<Usuario | null> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña AS contrasenia, fecha_registro FROM USUARIO WHERE id_usuario = ?",
        [id]
      );

      if (rows.length === 0) return null;

      const r = rows[0];
      return new Usuario(
        r.id_usuario,
        r.nombre,
        r.nombre,
        r.correo_electronico,
        r.contrasenia, // Contraseña garantizada desde el alias
        "usuario",
        true,
        r.fecha_registro
      );
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  }

// 3. Buscar usuario para el Login (por Correo Electrónico)
  async obtenerPorEmailOUsername(identificador: string): Promise<Usuario | null> {
    try {
      // Pedimos todas las variaciones posibles de nombre de columna para no fallar
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id_usuario, nombre, correo_electronico, contraseña, contraseña AS contrasenia FROM USUARIO WHERE correo_electronico = ?",
        [identificador]
      );

      if (rows.length === 0) return null;

      const r = rows[0];
      
      // Capturamos el hash buscando cualquier propiedad válida que devuelva MySQL
      const hashEncontrado = r.contrasenia || r.contraseña || r.contrasena;

      if (!hashEncontrado) {
        console.error("🚨 Alerta: No se encontró la columna de contraseña en el resultado de la DB:", r);
      }

      // Forzamos la creación del objeto pasando el hash directamente
      const usuario = new Usuario(
        r.id_usuario,
        r.nombre,
        r.nombre, // username
        r.correo_electronico,
        hashEncontrado, // Le pasamos la contraseña recuperada de forma segura
        "usuario",
        true
      );

      return usuario;
    } catch (error) {
      console.error("Error al obtener usuario por correo:", error);
      throw error;
    }
  }

  // 4. Agregar / Registrar un nuevo usuario de forma segura
  async agregarUsuario(
    nombre: string,
    username: string,
    email: string,
    passwordPlana: string,
    rol: RolUsuario = "usuario"
  ): Promise<Usuario> {
    try {
      // Encriptamos la contraseña antes de guardarla en la BD
      const passwordEncriptada = hashPassword(passwordPlana);

      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO USUARIO (nombre, correo_electronico, contraseña) VALUES (?, ?, ?)",
        [nombre, email, passwordEncriptada]
      );

      const nuevoId = result.insertId;

      return new Usuario(
        nuevoId,
        nombre,
        username,
        email,
        passwordEncriptada,
        rol,
        true
      );
    } catch (error) {
      console.error("Error al registrar usuario en la DB:", error);
      throw error;
    }
  }

  // 5. Eliminar un usuario de la BD
  async eliminarUsuario(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM USUARIO WHERE id_usuario = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar usuario de la DB:", error);
      throw error;
    }
  }
}

export const usuarioManager = new UsuarioManager();