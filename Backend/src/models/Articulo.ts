export default class Articulo {
    private id: number;
    private titulo: string;
    private contenido: string;
    private fecha: string;
    private categoria: string;
    private autor: string;
    private resumen: string;
    private tiempoLectura: number;
    private tags: string[];
    private destacado: boolean;

    constructor(
        id: number,
        titulo: string,
        contenido: string,
        fecha: string,
        categoria: string = "Educación financiera",
        autor: string = "Equipo BETA",
        resumen: string = "",
        tiempoLectura: number = 4,
        tags: string[] = [],
        destacado: boolean = false
    ) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.fecha = fecha;
        this.categoria = categoria;
        this.autor = autor;
        this.resumen = resumen && resumen.length > 0 ? resumen : contenido.slice(0, 140).trim() + "...";
        this.tiempoLectura = tiempoLectura;
        this.tags = tags;
        this.destacado = destacado;
    }

    public getId(): number { return this.id; }
    public getTitulo(): string { return this.titulo; }
    public getContenido(): string { return this.contenido; }
    public getFecha(): string { return this.fecha; }
    public getCategoria(): string { return this.categoria; }
    public getAutor(): string { return this.autor; }
    public getResumen(): string { return this.resumen; }
    public getTiempoLectura(): number { return this.tiempoLectura; }
    public getTags(): string[] { return this.tags; }
    public getDestacado(): boolean { return this.destacado; }
}