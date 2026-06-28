import { Router } from "express";
import Articulo from "../models/Articulo";
import EducativoManager from "../services/educativoManager";
const router = Router();
const manager = new EducativoManager();
// el usuarii lee los articulos
router.get("/", (req, res) => {
    res.json(manager.obtenerArticulos());
});
// y aqui el admin publica articulos
router.post("/", (req, res) => {
    const data = req.body as { titulo: string, contenido: string, fecha: string };
    const nuevoArticulo = new Articulo(Date.now(), data.titulo, data.contenido, data.fecha);
    
    manager.agregarArticulo(nuevoArticulo);
    res.status(201).json({ mensaje: "Artículo publicado", articulo: nuevoArticulo });
});

export default router;