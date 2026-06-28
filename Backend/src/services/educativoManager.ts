import Articulo from "../models/Articulo";
export default class EducativoManager {
    private articulos: Articulo[] = [];

    constructor() {
        // Artículo de prueba para que tengas algo que leer
        this.articulos.push(
            new Articulo(1, "¿Cómo ahorrar tu primera quincena?", "El ahorro es fundamental... CONTENIDO DE PRUEBA", "06-08-2026")
        );
    }
    obtenerArticulos(): Articulo[] {
        return this.articulos;
    }
    agregarArticulo(articulo: Articulo): void {
        this.articulos.push(articulo);
    }
}