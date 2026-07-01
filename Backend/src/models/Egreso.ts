import Movimiento from "./Movimiento";
export default class Egreso extends Movimiento {
  constructor(
    id: number,
    monto: number,
    descripcion: string,
    fecha: string,
    tipo: string,
    categoria: string
  ) {
    super(id, monto, descripcion, fecha, tipo, categoria);
  }

  override obtenerDetalle(): string {
    return `Egreso: ${this.getDescripcion()} por $${this.getMonto()}`;
  }
}