import { Router, Response } from "express";
import { movimientoManager } from "../services/movimientosManager.js";
import { verificarAutenticacion, RequestConUsuario } from "../middleware/authMiddleware.js";

const router = Router();

// GET /informes?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
// Devuelve el resumen (ingresos, egresos, balance, por categoría)
// del usuario autenticado dentro del rango de fechas dado.
router.get("/", verificarAutenticacion, async (req: RequestConUsuario, res: Response): Promise<any> => {
  try {
    const fechaInicio = req.query.inicio as string;
    const fechaFin = req.query.fin as string;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debes enviar fecha de inicio y fin" });
    }

    const resumen = await movimientoManager.obtenerResumen(fechaInicio, fechaFin, req.usuarioId!);
    res.status(200).json(resumen);
  } catch (error) {
    console.error("Error en /informes:", error);
    res.status(500).json({ error: "No se pudo generar el informe" });
  }
});

export default router;