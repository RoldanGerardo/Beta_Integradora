import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../services/authService";
import { usuarioManager } from "../services/usuarioManager";

export interface RequestConUsuario extends Request {
  usuarioId?: number;
  usuarioRol?: string;
}

// 1. Agregamos 'async' aquí
export async function verificarAutenticacion(req: RequestConUsuario, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autenticado" });
  }
  
  const token = authHeader.slice(7);
  const payload = verificarToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }

  try {
    // 2. Agregamos 'await' para resolver la Promesa de la base de datos
    const usuario = await usuarioManager.obtenerPorId(payload.id);
    
    // Al hacer '!usuario', TypeScript ya sabe que si pasa de aquí, 'usuario' no es undefined
    if (!usuario || !usuario.getActivo()) {
      return res.status(401).json({ error: "Usuario no válido" });
    }
    
    req.usuarioId = payload.id;
    req.usuarioRol = payload.rol;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor al validar el usuario" });
  }
}

export function requireAdmin(req: RequestConUsuario, res: Response, next: NextFunction) {
  if (req.usuarioRol !== "admin") {
    return res.status(403).json({ error: "No tienes permisos de administrador" });
  }
  next();
}