import { Router, Response } from "express";
import { movimientoManager } from "../services/movimientosManager";
import { verificarAutenticacion, RequestConUsuario } from "../middleware/authMiddleware";

const router = Router();
router.use(verificarAutenticacion);

const mapMovimiento = (m: any) => ({
  id: m.getId(),
  monto: m.getMonto(),
  descripcion: m.getDescripcion(),
  fecha: m.getFecha(),
  tipo: m.getTipo(),
  categoria: m.getCategoria(),
});

router.get("/", async (req: RequestConUsuario, res: Response) => {
  try {
    const { tipo } = req.query;
    const resultado =
      tipo === "ingreso" || tipo === "egreso"
        ? await movimientoManager.obtenerMovimientosPorTipo(req.usuarioId!, tipo)
        : await movimientoManager.obtenerMovimientos(req.usuarioId!);
    res.status(200).json(resultado.map(mapMovimiento));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de servidor" });
  }
});

router.post("/", async (req: RequestConUsuario, res: Response) => {
  const { monto, descripcion, fecha, tipo, categoria } = req.body;

  if (!monto || !descripcion || !fecha || (tipo !== "ingreso" && tipo !== "egreso")) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: monto, descripcion, fecha y tipo ('ingreso' | 'egreso')",
    });
  }

  try {
    const nuevo = await movimientoManager.agregarMovimiento(req.usuarioId!, {
      monto: Number(monto),
      descripcion,
      fecha,
      tipo,
      categoria: categoria ?? "General",
    });
    res.status(201).json(mapMovimiento(nuevo));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de servidor" });
  }
});

router.delete("/:id", async (req: RequestConUsuario, res: Response) => {
  const id = Number(req.params.id);
  try {
    const existia = await movimientoManager.eliminarMovimiento(req.usuarioId!, id);
    if (!existia) return res.status(404).json({ error: "Movimiento no encontrado" });
    res.status(200).json({ mensaje: "Movimiento eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de servidor" });
  }
});

export default router;