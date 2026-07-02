// para administrar los ingresos y egresos de Beta
import Movimiento from "../models/Movimiento";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";

export default class MovimientoManager {
  private movimientos: Movimiento[] = []; //arreglo

  obtenerMovimientos(): Movimiento[] {
    return this.movimientos;
  }

  obtenerMovimientosPorTipo(tipo: "ingreso" | "egreso"): Movimiento[] {
    return this.movimientos.filter((mov) => mov.getTipo() === tipo);
  }

  agregarMovimiento(movimiento: Movimiento): void {
    this.movimientos.push(movimiento);
  }

  eliminarMovimiento(id: number): boolean {
    const existia = this.movimientos.some((mov) => mov.getId() === id);
    this.movimientos = this.movimientos.filter((mov) => mov.getId() !== id);
    return existia;
  }

  obtenerResumen(fechaInicio: string, fechaFin: string) {
    // Filtramos los movimientos que caen entre las fechas indicadas
    const filtrados = this.movimientos.filter(
      (mov) => mov.getFecha() >= fechaInicio && mov.getFecha() <= fechaFin
    );

    let totalIngresos = 0;
    let totalEgresos = 0;

    filtrados.forEach((mov) => {
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
      movimientosDelPeriodo: filtrados,
    };
  }
}
export const movimientoManager = new MovimientoManager();