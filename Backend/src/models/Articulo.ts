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
    private imagen: string;

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
        destacado: boolean = false,
        imagen: string = ""
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
        this.imagen = imagen;
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
    public getImagen(): string { return this.imagen; }

    public setTitulo(v: string) { this.titulo = v; }
    public setContenido(v: string) { this.contenido = v; }
    public setFecha(v: string) { this.fecha = v; }
    public setCategoria(v: string) { this.categoria = v; }
    public setAutor(v: string) { this.autor = v; }
    public setResumen(v: string) {
        this.resumen = v && v.length > 0 ? v : this.contenido.slice(0, 140).trim() + "...";
    }
    public setTiempoLectura(v: number) { this.tiempoLectura = v; }
    public setTags(v: string[]) { this.tags = v; }
    public setDestacado(v: boolean) { this.destacado = v; }
    public setImagen(v: string) { this.imagen = v; }

    public toPlano() {
        return {
            id: this.id,
            titulo: this.titulo,
            contenido: this.contenido,
            fecha: this.fecha,
            categoria: this.categoria,
            autor: this.autor,
            resumen: this.resumen,
            tiempoLectura: this.tiempoLectura,
            tags: this.tags,
            destacado: this.destacado,
            imagen: this.imagen,
        };
    }
}