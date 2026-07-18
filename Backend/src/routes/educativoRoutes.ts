import { Router, Request, Response } from "express";
import Articulo from "../models/Articulo";
import { educativoManager } from "../services/educativoManager";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

type DatosArticulo = {
    titulo: string;
    contenido: string;
    fecha: string;
    categoria?: string;
    autor?: string;
    resumen?: string;
    tiempoLectura?: number;
    tags?: string[];
    destacado?: boolean;
    imagen?: string;
};

// el usuario lee los articulos (público, sin autenticación)
router.get("/", (req: Request, res: Response) => {
    res.status(200).json(educativoManager.obtenerArticulos().map((a) => a.toPlano()));
});

router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const articulo = educativoManager.obtenerArticuloPorId(id);
    if (!articulo) return res.status(404).json({ error: "Artículo no encontrado" });
    res.status(200).json(articulo.toPlano());
});

// a partir de aquí, sólo el administrador puede publicar, editar o eliminar
router.use(verificarAutenticacion, requireAdmin);

router.post("/", (req: Request, res: Response) => {
    const data = req.body as DatosArticulo;

    if (!data.titulo || !data.contenido || !data.fecha) {
        return res.status(400).json({
            error: "Faltan campos obligatorios: titulo, contenido y fecha",
        });
    }

    const nuevoArticulo = new Articulo(
        Date.now(),
        data.titulo,
        data.contenido,
        data.fecha,
        data.categoria,
        data.autor,
        data.resumen,
        data.tiempoLectura,
        data.tags,
        data.destacado,
        data.imagen
    );

    educativoManager.agregarArticulo(nuevoArticulo);
    res.status(201).json(nuevoArticulo.toPlano());
});

router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = req.body as Partial<DatosArticulo>;

    const actualizado = educativoManager.actualizarArticulo(id, data);
    if (!actualizado) return res.status(404).json({ error: "Artículo no encontrado" });

    res.status(200).json(actualizado.toPlano());
});

router.delete("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const existia = educativoManager.eliminarArticulo(id);

    if (!existia) {
        return res.status(404).json({ error: "Artículo no encontrado" });
    }

    res.status(200).json({ mensaje: "Artículo eliminado" });
});

export default router;