import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager.js";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verificarAutenticacion, requireAdmin);

router.get("/", async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioManager.obtenerTodos();
    res.status(200).json(usuarios.map((u) => u.toPublico()));
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { nombre, username, email, password, rol } = req.body;
    if (!nombre || !username || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const nuevo = await usuarioManager.agregarUsuario(
      nombre,
      username,
      email,
      password,
      rol === "admin" ? "admin" : "usuario"
    );
    res.status(201).json(nuevo.toPublico());
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "No se pudo crear el usuario",
    });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const actualizado = await usuarioManager.actualizarUsuario(id, req.body);
    if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(actualizado.toPublico());
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
});

router.patch("/:id/estado", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body as { activo: boolean };
    const actualizado = await usuarioManager.actualizarUsuario(id, { activo });
    if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(actualizado.toPublico());
  } catch (error) {
    res.status(500).json({ error: "No se pudo cambiar el estado" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const existia = await usuarioManager.eliminarUsuario(id);
    if (!existia) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
});

export default router;