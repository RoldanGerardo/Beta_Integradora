import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware";

const router = Router();
router.use(verificarAutenticacion, requireAdmin);

router.get("/", (req: Request, res: Response) => {
  res.status(200).json(usuarioManager.obtenerTodos().map((u) => u.toPublico()));
});

router.post("/", (req: Request, res: Response) => {
  const { nombre, username, email, password, rol } = req.body;
  if (!nombre || !username || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  const nuevo = usuarioManager.agregarUsuario(nombre, username, email, password, rol === "admin" ? "admin" : "usuario");
  res.status(201).json(nuevo.toPublico());
});

router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const actualizado = usuarioManager.actualizarUsuario(id, req.body);
  if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(actualizado.toPublico());
});

router.patch("/:id/estado", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };
  const actualizado = usuarioManager.actualizarUsuario(id, { activo });
  if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(actualizado.toPublico());
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existia = usuarioManager.eliminarUsuario(id);
  if (!existia) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json({ mensaje: "Usuario eliminado" });
});

export default router;