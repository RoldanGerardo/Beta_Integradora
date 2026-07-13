import sql from "mssql";
import { conectarDB } from "../config/db"; 
import Usuario, { RolUsuario } from "../models/Usuario";
import { hashPassword } from "./authService";

function mapRow(row: any): Usuario {
  const fecha = row.fecha_registro instanceof Date
    ? row.fecha_registro.toISOString().split("T")[0]
    : row.fecha_registro;
  return new Usuario(
    row.id_usuario,
    row.nombre,
    row.username,
    row.correo_electronico,
    row.contrasena,
    row.rol as RolUsuario,
    row.activo,
    fecha
  );
}

export default class UsuarioManager {
  async agregarUsuario(
    nombre: string,
    username: string,
    email: string,
    password: string,
    rol: RolUsuario = "usuario"
  ): Promise<Usuario> {
    const pool = await conectarDB();
    const passwordHash = hashPassword(password);
    const result = await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("passwordHash", sql.NVarChar, passwordHash)
      .input("rol", sql.NVarChar, rol)
      .query(`
        INSERT INTO USUARIO (nombre, username, correo_electronico, contrasena, rol, activo)
        OUTPUT INSERTED.*
        VALUES (@nombre, @username, @email, @passwordHash, @rol, 1)
      `);
    return mapRow(result.recordset[0]);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    const pool = await conectarDB();
    const result = await pool.request().query("SELECT * FROM USUARIO ORDER BY id_usuario");
    return result.recordset.map(mapRow);
  }

  async obtenerPorId(id: number): Promise<Usuario | undefined> {
    const pool = await conectarDB();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM USUARIO WHERE id_usuario = @id");
    return result.recordset[0] ? mapRow(result.recordset[0]) : undefined;
  }

  async obtenerPorEmailOUsername(identificador: string): Promise<Usuario | undefined> {
    const pool = await conectarDB();
    const result = await pool
      .request()
      .input("identificador", sql.NVarChar, identificador)
      .query("SELECT * FROM USUARIO WHERE correo_electronico = @identificador OR username = @identificador");
    return result.recordset[0] ? mapRow(result.recordset[0]) : undefined;
  }

  async actualizarUsuario(
    id: number,
    datos: Partial<{ nombre: string; username: string; email: string; rol: RolUsuario; activo: boolean }>
  ): Promise<Usuario | null> {
    const existente = await this.obtenerPorId(id);
    if (!existente) return null;

    const pool = await conectarDB();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", datos.nombre ?? existente.getNombre())
      .input("username", datos.username ?? existente.getUsername())
      .input("email", datos.email ?? existente.getEmail())
      .input("rol", datos.rol ?? existente.getRol())
      .input("activo", sql.Bit, datos.activo ?? existente.getActivo())
      .query(`
        UPDATE USUARIO
        SET nombre = @nombre, username = @username, correo_electronico = @email, rol = @rol, activo = @activo
        WHERE id_usuario = @id
      `);
      
    // 2. Convertimos el 'undefined' potencial a 'null' para cumplir con la firma del método
    const actualizado = await this.obtenerPorId(id);
    return actualizado ?? null;
  }

  async eliminarUsuario(id: number): Promise<boolean> {
    const pool = await conectarDB();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM USUARIO WHERE id_usuario = @id");
    return (result.rowsAffected[0] ?? 0) > 0;
  }

  async sembrarUsuariosIniciales(): Promise<void> {
    const admin = await this.obtenerPorEmailOUsername("admin@beta.mx");
    if (!admin) {
      await this.agregarUsuario("Administrador BETA", "admin", "admin@beta.mx", "Admin123!", "admin");
    }
    const demo = await this.obtenerPorEmailOUsername("demo@beta.mx");
    if (!demo) {
      await this.agregarUsuario("Usuario Demo", "usuario_67", "demo@beta.mx", "contraseña", "usuario");
    }
  }
}

export const usuarioManager = new UsuarioManager();