import { Router, Request, Response } from "express";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";
import { movimientoManager } from "../services/movimientosManager";

const router = Router();

// convierte una instancia de Movimiento a un objeto plano para el frontend
const mapMovimiento = (m: any) => ({
  id: m.getId(),
  monto: m.getMonto(),
  descripcion: m.getDescripcion(),
  fecha: m.getFecha(),
  tipo: m.getTipo(),
  categoria: m.getCategoria(),
});

router.get("/", (req: Request, res: Response) => {
  const { tipo } = req.query;
  let resultado = movimientoManager.obtenerMovimientos();
  if (tipo === "ingreso" || tipo === "egreso") {
    resultado = movimientoManager.obtenerMovimientosPorTipo(tipo);
  }
  res.status(200).json(resultado.map(mapMovimiento));
});

router.post("/", (req: Request, res: Response) => {
  const { monto, descripcion, fecha, tipo, categoria } = req.body;

  if (!monto || !descripcion || !fecha || (tipo !== "ingreso" && tipo !== "egreso")) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios: monto, descripcion, fecha y tipo ('ingreso' | 'egreso')",
    });
  }

  // genera el id
  const id = Date.now();

  let nuevo;
  if (tipo === "ingreso") {
    nuevo = new Ingreso(id, Number(monto), descripcion, fecha, tipo, categoria ?? "General");
  } else {
    nuevo = new Egreso(id, Number(monto), descripcion, fecha, tipo, categoria ?? "General");
  }

  movimientoManager.agregarMovimiento(nuevo);
  res.status(201).json(mapMovimiento(nuevo));
});

// borra
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existia = movimientoManager.eliminarMovimiento(id);

  if (!existia) {
    return res.status(404).json({ error: "Movimiento no encontrado" });
  }

  res.status(200).json({ mensaje: "Movimiento eliminado" });
});

export default router;