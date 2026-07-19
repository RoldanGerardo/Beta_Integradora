import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager.js";
import { movimientoManager } from "../services/movimientosManager.js";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();
router.use(verificarAutenticacion, requireAdmin);

router.get("/", async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioManager.obtenerTodos();
    const movimientos = await movimientoManager.obtenerTodosLosMovimientos();

    res.status(200).json({
      totalUsuarios: usuarios.length,
      usuariosActivos: usuarios.filter((u) => u.getActivo()).length,
      totalMovimientos: movimientos.length,
      ultimosMovimientos: movimientos.slice(-5).reverse().map((m: any) => ({
        id: m.id,
        descripcion: m.descripcion,
        monto: m.monto,
        tipo: m.tipo,
        fecha: m.fecha,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el dashboard" });
  }
});

export default router;