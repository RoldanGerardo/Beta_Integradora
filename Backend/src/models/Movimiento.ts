export default class Movimiento {
    private id: number;
    private monto: number;
    private descripcion: string;
    private fecha: string;

    constructor(id: number, monto: number, descripcion: string, fecha: string) {
        this.id = id;
        this.monto = monto;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    // getters
    public getId(): number { return this.id; }
    public getMonto(): number { return this.monto; }
    public getDescripcion(): string { return this.descripcion; }
    public getFecha(): string { return this.fecha; }

    public obtenerDetalle(): string {
        return `Movimiento de $${this.monto} el ${this.fecha}`;
    }
}