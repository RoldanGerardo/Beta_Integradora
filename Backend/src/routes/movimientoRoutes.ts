import { Router, Request, Response } from "express";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";

const router = Router();

// Datos de prueba iniciales
let historialMovimientos: any[] = [
  new Ingreso(1001, 5000, "Salario mensual", "2026-06-01", "ingreso", "Trabajo"),
  new Egreso(1002, 1200, "Pago de renta", "2026-06-05", "egreso", "Escuela"),
  new Egreso(1003, 300, "Compra de despensa", "2026-06-10", "egreso", "Comida"),
];

// Convierte una instancia de Movimiento a un objeto plano para el frontend
const mapMovimiento = (m: any) => ({
  id: m.getId(),
  monto: m.getMonto(),
  descripcion: m.getDescripcion(),
  fecha: m.getFecha(),
  tipo: m.getTipo(),
  categoria: m.getCategoria(),
});

// GET /movimientos          -> todos
// GET /movimientos?tipo=ingreso  -> solo ingresos
// GET /movimientos?tipo=egreso   -> solo egresos
router.get("/", (req: Request, res: Response) => {
  const { tipo } = req.query;

  let resultado = historialMovimientos;
  if (tipo === "ingreso" || tipo === "egreso") {
    resultado = historialMovimientos.filter((m) => m.getTipo() === tipo);
  }

  res.status(200).json(resultado.map(mapMovimiento));
});

// POST /movimientos
router.post("/", (req: Request, res: Response) => {
  const { monto, descripcion, fecha, tipo, categoria } = req.body;

  if (!monto || !descripcion || !fecha || (tipo !== "ingreso" && tipo !== "egreso")) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: monto, descripcion, fecha y tipo ('ingreso' | 'egreso')",
    });
  }

  const id = Date.now();
  const nuevo =
    tipo === "ingreso"
      ? new Ingreso(id, Number(monto), descripcion, fecha, tipo, categoria ?? "General")
      : new Egreso(id, Number(monto), descripcion, fecha, tipo, categoria ?? "General");

  historialMovimientos.push(nuevo);
  res.status(201).json(mapMovimiento(nuevo));
});

// DELETE /movimientos/:id
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existia = historialMovimientos.some((m) => m.getId() === id);

  if (!existia) {
    return res.status(404).json({ error: "Movimiento no encontrado" });
  }

  historialMovimientos = historialMovimientos.filter((m) => m.getId() !== id);
  res.status(200).json({ mensaje: "Movimiento eliminado" });
});

export default router;