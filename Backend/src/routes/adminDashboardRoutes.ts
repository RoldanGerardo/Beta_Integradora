import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager";
import { movimientoManager } from "../services/movimientosManager";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware";

const router = Router();
router.use(verificarAutenticacion, requireAdmin);

router.get("/", (req: Request, res: Response) => {
  const usuarios = usuarioManager.obtenerTodos();
  const movimientos = movimientoManager.obtenerMovimientos();

  res.status(200).json({
    totalUsuarios: usuarios.length,
    usuariosActivos: usuarios.filter((u) => u.getActivo()).length,
    totalMovimientos: movimientos.length,
    ultimosMovimientos: movimientos.slice(-5).reverse().map((m) => ({
      id: m.getId(),
      descripcion: m.getDescripcion(),
      monto: m.getMonto(),
      tipo: m.getTipo(),
      fecha: m.getFecha(),
    })),
  });
});

export default router;