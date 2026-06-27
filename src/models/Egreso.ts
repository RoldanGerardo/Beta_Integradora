import Movimiento from "./Movimiento";

export default class Egreso extends Movimiento {
    constructor(id: number, monto: number, descripcion: string, fecha: string) {
        super(id, monto, descripcion, fecha);
    }
    
    override obtenerDetalle(): string {
        return `Egreso: ${this.getDescripcion()} por $${this.getMonto()}`;
    }
}