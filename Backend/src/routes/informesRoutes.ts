import { Router, Response } from "express";
import { movimientoManager } from "../services/movimientosManager";
import { verificarAutenticacion, RequestConUsuario } from "../middleware/authMiddleware";

const router = Router();
router.use(verificarAutenticacion);

router.get("/", async (req: RequestConUsuario, res: Response) => {
  const fechaInicio = req.query.inicio as string;
  const fechaFin = req.query.fin as string;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: "Debes enviar fecha de inicio y fin" });
  }

  try {
    const resumen = await movimientoManager.obtenerResumen(req.usuarioId!, fechaInicio, fechaFin);
    res.json(resumen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de servidor" });
  }
});

export default router;