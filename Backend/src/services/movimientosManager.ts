// para administrar los ingresos y egresos de Beta
import Movimiento from "../models/Movimiento";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";

export default class MovimientoManager {
  private movimientos: Movimiento[] = []; //arreglo

  constructor() {
    // Datos de prueba
    this.movimientos.push(
      new Ingreso(1001, 5000, "Salario mensual", "2026-06-01", "ingreso", "Trabajo"),
      new Egreso(1002, 1200, "Pago de renta", "2026-06-05", "egreso", "Escuela"),
      new Egreso(1003, 300, "Compra de despensa", "2026-06-10", "egreso", "Comida"),
      new Ingreso(1004, 1500, "Mesada", "2026-06-25", "ingreso", "Mesada"),
      new Egreso(1005, 250, "Salida al cine", "2026-06-26", "egreso", "Salidas")
    );
  }

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