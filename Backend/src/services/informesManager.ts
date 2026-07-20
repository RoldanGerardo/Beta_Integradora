import db from "../config/db.js"; // Ajusta la ruta a tu archivo de conexión/pool de base de datos si varía

export interface ResumenInformes {
  porCategoria: Array<{ categoria: string; total: number }>;
  historico: Array<{ fecha: string; ingresos: number; egresos: number }>;
  resumen: {
    totalIngresos: number;
    totalEgresos: number;
    balance: number;
    categoriaMayorGasto: string;
    montoMayorGasto: number;
  };
}

export class InformesManager {
  /**
   * Obtiene el resumen de reportes financieros filtrado por usuario y rango de días
   */
  public static async obtenerResumen(usuarioId: number, dias: number = 30): Promise<ResumenInformes> {
    try {
      // 1. Gastos agrupados por Categoría
      const [porCategoriaRows]: any = await db.query(
        `SELECT categoria, SUM(monto) AS total
         FROM movimientos
         WHERE usuario_id = ? AND tipo = 'egreso'
         GROUP BY categoria
         ORDER BY total DESC`,
        [usuarioId]
      );

      // 2. Historial de Ingresos vs Egresos por fecha (por defecto últimos 30 días)
      const [historicoRows]: any = await db.query(
        `SELECT DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
                SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS ingresos,
                SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS egresos
         FROM movimientos
         WHERE usuario_id = ? AND fecha >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY DATE(fecha)
         ORDER BY fecha ASC`,
        [usuarioId, dias]
      );

      // 3. Totales generales de todos los tiempos o del periodo
      const [totalesRows]: any = await db.query(
        `SELECT 
            SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS totalIngresos,
            SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS totalEgresos
         FROM movimientos
         WHERE usuario_id = ?`,
        [usuarioId]
      );

      // Formatear resultados
      const porCategoria = porCategoriaRows.map((r: any) => ({
        categoria: r.categoria,
        total: Number(r.total) || 0,
      }));

      const historico = historicoRows.map((r: any) => ({
        fecha: r.fecha,
        ingresos: Number(r.ingresos) || 0,
        egresos: Number(r.egresos) || 0,
      }));

      const totalIngresos = Number(totalesRows[0]?.totalIngresos) || 0;
      const totalEgresos = Number(totalesRows[0]?.totalEgresos) || 0;
      const mayorGasto = porCategoria[0] || null;

      return {
        porCategoria,
        historico,
        resumen: {
          totalIngresos,
          totalEgresos,
          balance: totalIngresos - totalEgresos,
          categoriaMayorGasto: mayorGasto ? mayorGasto.categoria : "Sin egresos",
          montoMayorGasto: mayorGasto ? mayorGasto.total : 0,
        },
      };
    } catch (error) {
      console.error("Error en InformesManager.obtenerResumen:", error);
      throw error;
    }
  }
}