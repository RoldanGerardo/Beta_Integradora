import Usuario, { RolUsuario } from "../models/Usuario";
import { hashPassword } from "./authService";

export default class UsuarioManager {
  private usuarios: Usuario[] = [];
  private siguienteId = 1;

  constructor() {
    // Cuenta admin sembrada para que puedas entrar de inmediato.
    this.agregarUsuario("Administrador BETA", "admin", "admin@beta.mx", "Admin123!", "admin");
    this.agregarUsuario("Usuario Demo", "usuario_67", "demo@beta.mx", "contraseña", "usuario");
  }

  agregarUsuario(nombre: string, username: string, email: string, password: string, rol: RolUsuario = "usuario"): Usuario {
    const nuevo = new Usuario(this.siguienteId++, nombre, username, email, hashPassword(password), rol);
    this.usuarios.push(nuevo);
    return nuevo;
  }

  obtenerTodos(): Usuario[] {
    return this.usuarios;
  }

  obtenerPorId(id: number): Usuario | undefined {
    return this.usuarios.find((u) => u.getId() === id);
  }

  obtenerPorEmailOUsername(identificador: string): Usuario | undefined {
    return this.usuarios.find(
      (u) => u.getEmail() === identificador || u.getUsername() === identificador
    );
  }

  actualizarUsuario(id: number, datos: Partial<{ nombre: string; username: string; email: string; rol: RolUsuario; activo: boolean }>): Usuario | null {
    const usuario = this.obtenerPorId(id);
    if (!usuario) return null;
    if (datos.nombre !== undefined) usuario.setNombre(datos.nombre);
    if (datos.username !== undefined) usuario.setUsername(datos.username);
    if (datos.email !== undefined) usuario.setEmail(datos.email);
    if (datos.rol !== undefined) usuario.setRol(datos.rol);
    if (datos.activo !== undefined) usuario.setActivo(datos.activo);
    return usuario;
  }

  eliminarUsuario(id: number): boolean {
    const existia = this.usuarios.some((u) => u.getId() === id);
    this.usuarios = this.usuarios.filter((u) => u.getId() !== id);
    return existia;
  }
}

export const usuarioManager = new UsuarioManager();