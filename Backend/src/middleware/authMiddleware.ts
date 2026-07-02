import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../services/authService";
import { usuarioManager } from "../services/usuarioManager";

export interface RequestConUsuario extends Request {
  usuarioId?: number;
  usuarioRol?: string;
}

export function verificarAutenticacion(req: RequestConUsuario, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado" });
  }
  const token = authHeader.slice(7);
  const payload = verificarToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }
  const usuario = usuarioManager.obtenerPorId(payload.id);
  if (!usuario || !usuario.getActivo()) {
    return res.status(401).json({ error: "Usuario no válido" });
  }
  req.usuarioId = payload.id;
  req.usuarioRol = payload.rol;
  next();
}

export function requireAdmin(req: RequestConUsuario, res: Response, next: NextFunction) {
  if (req.usuarioRol !== "admin") {
    return res.status(403).json({ error: "No tienes permisos de administrador" });
  }
  next();
}