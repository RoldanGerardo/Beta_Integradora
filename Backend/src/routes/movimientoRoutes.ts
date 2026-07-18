import { Router, Request, Response } from "express";
import { movimientoManager } from "../services/movimientosManager.js";

const router = Router();

// 1. GET: Obtener movimientos (con opción de filtrar por tipo en la URL '?tipo=ingreso')
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { tipo } = req.query;
    let resultado;

    if (tipo === "ingreso" || tipo === "egreso") {
      resultado = await movimientoManager.obtenerMovimientosPorTipo(tipo);
    } else {
      resultado = await movimientoManager.obtenerMovimientos();
    } 

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener los movimientos" });
  }
});

// 2. POST: Registrar un movimiento
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { monto, descripcion, fecha, tipo, categoria, id_usuario } = req.body;

    // Validación básica de campos requeridos
    if (!monto || !descripcion || !fecha || (tipo !== "ingreso" && tipo !== "egreso")) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: monto, descripcion, fecha y tipo ('ingreso' | 'egreso')",
      });
    }

    // Nota temporal: Como aún no migramos el módulo de usuarios, usaremos el id_usuario enviado en el body, o por defecto el 1.
    const usuarioId = id_usuario ? Number(id_usuario) : 1; 

    const nuevoId = await movimientoManager.agregarMovimiento({
      id_usuario: usuarioId,
      nombre_categoria: categoria ?? "General",
      tipo,
      monto: Number(monto),
      descripcion,
      fecha
    });

    res.status(201).json({
      id: nuevoId,
      id_usuario: usuarioId,
      monto,
      descripcion,
      fecha,
      tipo,
      categoria: categoria ?? "General"
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno al registrar el movimiento. Verifica que existan registros asociados." });
  }
});

// 3. DELETE: Eliminar un movimiento por ID
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const existia = await movimientoManager.eliminarMovimiento(id);

    if (!existia) {
      return res.status(404).json({ error: "Movimiento no encontrado en la base de datos" });
    }

    res.status(200).json({ mensaje: "Movimiento eliminado correctamente de la base de datos" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al intentar eliminar el movimiento" });
  }
});

export default router;