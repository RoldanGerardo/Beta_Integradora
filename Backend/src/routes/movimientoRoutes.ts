import { Router, Request, Response } from "express";
import { movimientoManager } from "../services/movimientosManager.js";
import { verificarToken } from "../services/authService.js"; // <-- Importamos tu validador

const router = Router();

// Función auxiliar para validar el token en cada petición HTTP
function obtenerUsuarioAutenticado(req: Request, res: Response): number | null {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Acceso denegado. No se proporcionó un token válido." });
    return null;
  }

  const token = authHeader.split(" ")[1];
  const payload = verificarToken(token);

  if (!payload) {
    res.status(401).json({ error: "Token inválido o expirado." });
    return null;
  }

  return payload.id; // Retorna el ID del usuario real extraído del token
}

// 1. GET: Obtener movimientos de forma PRIVADA
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const id_usuario = obtenerUsuarioAutenticado(req, res);
    if (id_usuario === null) return; // Si no hay usuario válido, la función auxiliar ya respondió 401

    const { tipo } = req.query;
    let resultado;

    if (tipo === "ingreso" || tipo === "egreso") {
      resultado = await movimientoManager.obtenerMovimientosPorTipo(tipo, id_usuario);
    } else {
      resultado = await movimientoManager.obtenerMovimientos(id_usuario);
    } 

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener los movimientos" });
  }
});

// 2. POST: Registrar un movimiento ligado al usuario real
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const id_usuario = obtenerUsuarioAutenticado(req, res);
    if (id_usuario === null) return;

    const { monto, descripcion, fecha, tipo, categoria } = req.body;

    // Validación básica de campos requeridos
    if (!monto || !descripcion || !fecha || (tipo !== "ingreso" && tipo !== "egreso")) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: monto, descripcion, fecha y tipo ('ingreso' | 'egreso')",
      });
    }

    const nuevoId = await movimientoManager.agregarMovimiento({
      id_usuario: id_usuario, // <-- Adiós al valor temporal "1", usamos el del token
      nombre_categoria: categoria ?? "General",
      tipo,
      monto: Number(monto),
      descripcion,
      fecha
    });

    res.status(201).json({
      id: nuevoId,
      id_usuario: id_usuario,
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

// 3. DELETE: Eliminar un movimiento asegurando propiedad
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id_usuario = obtenerUsuarioAutenticado(req, res);
    if (id_usuario === null) return;

    const id = Number(req.params.id);
    // Le pasamos el ID del movimiento Y el ID del usuario para validar en el query
    const existia = await movimientoManager.eliminarMovimiento(id, id_usuario);

    if (!existia) {
      return res.status(404).json({ error: "Movimiento no encontrado o no tienes permisos para eliminarlo." });
    }

    res.status(200).json({ mensaje: "Movimiento eliminado correctamente de la base de datos" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al intentar eliminar el movimiento" });
  }
});

export default router;