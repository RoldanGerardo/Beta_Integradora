import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager";
import { verificarPassword, generarToken } from "../services/authService";
import { verificarAutenticacion, RequestConUsuario } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { identificador, password } = req.body as { identificador: string; password: string };

  if (!identificador || !password) {
    return res.status(400).json({ error: "Debes enviar identificador y password" });
  }

  const usuario = usuarioManager.obtenerPorEmailOUsername(identificador);
  if (!usuario || !usuario.getActivo() || !verificarPassword(password, usuario.getPasswordHash())) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = generarToken(usuario.getId(), usuario.getRol());
  res.status(200).json({ token, usuario: usuario.toPublico() });
});

router.get("/me", verificarAutenticacion, (req: RequestConUsuario, res: Response) => {
  const usuario = usuarioManager.obtenerPorId(req.usuarioId!);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json({ usuario: usuario.toPublico() });
});

export default router;