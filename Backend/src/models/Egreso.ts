import Movimiento from "./Movimiento";

export default class Egreso extends Movimiento {
    constructor(id: number, monto: number, descripcion: string, fecha: string, tipo: string, ) {
        super(id, monto, descripcion, fecha , tipo);
    }
    
    override obtenerDetalle(): string {
        return `Egreso: ${this.getDescripcion()} por $${this.getMonto()}`;
    }
}