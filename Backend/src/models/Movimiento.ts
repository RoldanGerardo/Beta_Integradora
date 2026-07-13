export default class Movimiento {
  private id: number;
  private monto: number;
  private descripcion: string;
  private fecha: string;
  private tipo: string;       // "ingreso" o "egreso"
  private categoria: string;  // becas , comida , trabajo , renta , luz , agua ,ect

  constructor(
    id: number,
    monto: number,
    descripcion: string,
    fecha: string,
    tipo: string,
    categoria: string
  ) {
    this.id = id;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.tipo = tipo;
    this.categoria = categoria;
  }

  public getId(): number { return this.id; }
  public getMonto(): number { return this.monto; }
  public getDescripcion(): string { return this.descripcion; }
  public getFecha(): string { return this.fecha; }
  public getTipo(): string { return this.tipo; }
  public getCategoria(): string { return this.categoria; }

  public obtenerDetalle(): string {
    return `Movimiento de $${this.monto} el ${this.fecha}`;
  }
}