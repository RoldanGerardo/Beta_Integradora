import { Router } from "express";
import MovimientoManager from "../services/movimientosManager";

const router = Router();
const manager = new MovimientoManager();

// get para tener el informe dependiento del rfago de la gecha
router.get("/", (req, res) => {
    // Tomamos las fechas que el frontend envie en la URL
    const fechaInicio = req.query.inicio as string;
    const fechaFin = req.query.fin as string;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "Debes enviar fecha de inicio y fin" });
    }

    const resumen = manager.obtenerResumen(fechaInicio, fechaFin);
    res.json(resumen);
});

export default router;