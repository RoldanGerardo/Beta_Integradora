import { Router } from "express"; // el route redirige
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";
import MovimientoManager from "../services/movimientosManager";

const router = Router();
const manager = new MovimientoManager();

// GET: Obtener todos
router.get("/", (req, res) => {
    res.json(manager.obtenerMovimientos());
});

// POST: Registrar nuevo
router.post("/", (req, res) => {
    const data = req.body as { monto: number, descripcion: string, fecha: string, tipo: string };
    
    const { monto, descripcion, fecha, tipo } = data;
    let nuevoMovimiento;

    if (tipo === "ingreso") {
        nuevoMovimiento = new Ingreso(Date.now(), Number(monto), descripcion, fecha , tipo);
    } else {
        nuevoMovimiento = new Egreso(Date.now(), Number(monto), descripcion, fecha, tipo);
    }

    manager.agregarMovimiento(nuevoMovimiento);
    res.status(201).json({ mensaje: "Movimiento registrado", movimiento: nuevoMovimiento });
});

// DELETE para eliminar por ID
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    manager.eliminarMovimiento(id);
    res.json({ mensaje: "Movimiento eliminado correctamente" });
});
export default router;