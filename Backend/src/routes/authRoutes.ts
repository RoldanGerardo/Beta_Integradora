import { Router, Request, Response } from "express";
import { usuarioManager } from "../services/usuarioManager.js";
import { verificarPassword, generarToken } from "../services/authService.js";
import { verificarAutenticacion, RequestConUsuario } from "../middleware/authMiddleware.js";

const router = Router();

// 1. POST: Registrar un nuevo usuario y darle acceso automático
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { nombre, username, email, password } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios. Debes enviar nombre, email y password." 
      });
    }

    // Verificar si el correo ya está registrado en la base de datos
    const usuarioExistente = await usuarioManager.obtenerPorEmailOUsername(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Guardar en la Base de Datos usando tu Manager (el cual aplica hashPassword de forma nativa)
    const nombreUsuario = username || nombre.toLowerCase().replace(/\s+/g, ""); // Username alternativo por compatibilidad
    const nuevoUsuario = await usuarioManager.agregarUsuario(
      nombre,
      nombreUsuario,
      email,
      password,
      "usuario" // Rol por defecto
    );

    // Generar el token de sesión de forma inmediata para el nuevo usuario
    const token = generarToken(nuevoUsuario.getId(), nuevoUsuario.getRol());

    // Responder con la misma estructura exacta que espera tu AuthContext ("beta_session")
    res.status(201).json({ 
      token, 
      usuario: nuevoUsuario.toPublico() 
    });
  } catch (error) {
    console.error("🚨 DETALLE DEL ERROR EN REGISTRO:", error);
    res.status(500).json({ error: "Error interno al procesar el registro de usuario." });
  }
});

// 2. POST: Iniciar sesión (Tu código actual, verificado e intacto)
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("=== DIAGNÓSTICO DE LOGIN ===");
    const { identificador, password } = req.body as { identificador: string; password: string };

    if (!identificador || !password) {
      return res.status(400).json({ error: "Debes enviar identificador (correo) y password" });
    }

    const usuario = await usuarioManager.obtenerPorEmailOUsername(identificador);
    
    if (!usuario) {
      return res.status(401).json({ error: "El usuario no existe" });
    }

    const passwordValida = verificarPassword(password, usuario.getPasswordHash());
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario.getId(), usuario.getRol());
    res.status(200).json({ token, usuario: usuario.toPublico() });
  } catch (error) {
    console.error("🚨 DETALLE DEL ERROR EN LOGIN:", error); 
    res.status(500).json({ error: "Error interno al procesar el inicio de sesión" });
  }
});

// 3. GET: Obtener el perfil del usuario autenticado actual
router.get("/me", verificarAutenticacion, async (req: RequestConUsuario, res: Response): Promise<any> => {
  try {
    const usuario = await usuarioManager.obtenerPorId(req.usuarioId!);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ usuario: usuario.toPublico() });
  } catch (error) {
    res.status(500).json({ error: "Error interno al consultar el perfil" });
  }
});

export default router;