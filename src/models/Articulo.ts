export default class Articulo {
    private id: number;
    private titulo: string;
    private contenido: string;
    private fecha: string;

    constructor(id: number, titulo: string, contenido: string, fecha: string) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.fecha = fecha;
    }

    public getId(): number { return this.id; }
    public getTitulo(): string { return this.titulo; }
    public getContenido(): string { return this.contenido; }
    public getFecha(): string { return this.fecha; }
}