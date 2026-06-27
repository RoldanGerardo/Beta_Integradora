import Movimiento from "./Movimiento";

export default class Ingreso extends Movimiento {
    constructor(id: number, monto: number, descripcion: string, fecha: string) {
        super(id, monto, descripcion, fecha);
    }
    
    override obtenerDetalle(): string {
        return `Ingreso: ${this.getDescripcion()} por $${this.getMonto()}`;
    }
}