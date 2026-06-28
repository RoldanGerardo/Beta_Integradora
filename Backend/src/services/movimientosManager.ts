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
    obtenerResumen(fechaInicio: string, fechaFin: string) {
        // Filtramos los movimientos que caen entre las fechas indicadas
        const filtrados = this.movimientos.filter(mov => 
            mov.getFecha() >= fechaInicio && mov.getFecha() <= fechaFin
        );

        let totalIngresos = 0;
        let totalEgresos = 0;

        filtrados.forEach(mov => {
            if (mov instanceof Ingreso) {
                totalIngresos += mov.getMonto();
            } else if (mov instanceof Egreso) {
                totalEgresos += mov.getMonto();
            }
        });

        return {
            ingresosTotales: totalIngresos,
            egresosTotales: totalEgresos,
            diferencia: totalIngresos - totalEgresos, // Lo que sobró o faltó
            movimientosDelPeriodo: filtrados
        };
    }
}