export interface Articulo {
    id?: number;
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
}