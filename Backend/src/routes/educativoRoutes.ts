import { Router, Request, Response } from "express";
import { educativoManager } from "../services/educativoManager.js";
import { verificarAutenticacion, requireAdmin } from "../middleware/authMiddleware.js";

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
router.get("/", async (req: Request, res: Response) => {
    try {
        const articulos = await educativoManager.obtenerArticulos();
        res.status(200).json(articulos.map((a) => a.toPlano()));
    } catch (error) {
        res.status(500).json({ error: "No se pudieron obtener los artículos" });
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const articulo = await educativoManager.obtenerArticuloPorId(id);
        if (!articulo) return res.status(404).json({ error: "Artículo no encontrado" });
        res.status(200).json(articulo.toPlano());
    } catch (error) {
        res.status(500).json({ error: "No se pudo obtener el artículo" });
    }
});

// a partir de aquí, sólo el administrador puede publicar, editar o eliminar
router.use(verificarAutenticacion, requireAdmin);

router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body as DatosArticulo;

        if (!data.titulo || !data.contenido || !data.fecha) {
            return res.status(400).json({
                error: "Faltan campos obligatorios: titulo, contenido y fecha",
            });
        }

        const nuevoArticulo = await educativoManager.agregarArticulo(data);
        res.status(201).json(nuevoArticulo.toPlano());
    } catch (error) {
        res.status(500).json({ error: "No se pudo publicar el artículo" });
    }
});

router.put("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const data = req.body as Partial<DatosArticulo>;

        const actualizado = await educativoManager.actualizarArticulo(id, data);
        if (!actualizado) return res.status(404).json({ error: "Artículo no encontrado" });

        res.status(200).json(actualizado.toPlano());
    } catch (error) {
        res.status(500).json({ error: "No se pudo actualizar el artículo" });
    }
});

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const existia = await educativoManager.eliminarArticulo(id);

        if (!existia) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        res.status(200).json({ mensaje: "Artículo eliminado" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo eliminar el artículo" });
    }
});

export default router;