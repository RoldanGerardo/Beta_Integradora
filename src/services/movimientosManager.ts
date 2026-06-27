// clase para administrar la pantalla tipo crud
// para administrar los ingresos y egresos de Beta
import Movimiento from "../models/Movimiento";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";

export default class MovimientoManager {
    private movimientos: Movimiento[] = []; // Lista o arreglo

    constructor() {
        // Datos de prueba
        this.movimientos.push(
            new Ingreso(1, 1500, "Mesada", "2026-06-25"),
            new Egreso(2, 250, "Salida al cine", "2026-06-26")
        );
    }

    obtenerMovimientos(): Movimiento[] {
        return this.movimientos;
    }

    agregarMovimiento(movimiento: Movimiento): void {
        this.movimientos.push(movimiento);
    }

    eliminarMovimiento(id: number) {
        this.movimientos = this.movimientos.filter(mov => mov.getId() !== id);
    }
}