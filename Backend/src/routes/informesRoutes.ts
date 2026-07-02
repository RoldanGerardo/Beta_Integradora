import { Router } from "express";
import { movimientoManager } from "../services/movimientosManager";

const router = Router();

// get para tener el informe dependiendo del rango de fecha
router.get("/", (req, res) => {
  // Tomamos las fechas que el frontend envíe en la URL
  const fechaInicio = req.query.inicio as string;
  const fechaFin = req.query.fin as string;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: "Debes enviar fecha de inicio y fin" });
  }

  const resumen = movimientoManager.obtenerResumen(fechaInicio, fechaFin);
  res.json(resumen);
});

export default router;