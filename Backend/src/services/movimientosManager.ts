import sql from "mssql";
import { getPool } from "../config/db";
import Movimiento from "../models/Movimiento";
import Ingreso from "../models/Ingreso";
import Egreso from "../models/Egreso";

type NuevoMovimiento = {
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: "ingreso" | "egreso";
  categoria: string;
};

const SELECT_BASE = `
  SELECT m.id_movimiento, m.monto, m.descripcion, m.fecha_movimiento, m.tipo_movimiento, c.nombre_categoria
  FROM MOVIMIENTO m
  JOIN CATEGORIA c ON c.id_categoria = m.id_categoria
`;

function mapRow(row: any): Movimiento {
  const fecha = row.fecha_movimiento instanceof Date
    ? row.fecha_movimiento.toISOString().split("T")[0]
    : row.fecha_movimiento;
  return row.tipo_movimiento === "ingreso"
    ? new Ingreso(row.id_movimiento, Number(row.monto), row.descripcion, fecha, row.tipo_movimiento, row.nombre_categoria)
    : new Egreso(row.id_movimiento, Number(row.monto), row.descripcion, fecha, row.tipo_movimiento, row.nombre_categoria);
}

export default class MovimientoManager {
  private async obtenerOCrearCategoria(pool: sql.ConnectionPool, nombreCategoria: string): Promise<number> {
    const existente = await pool
      .request()
      .input("nombre", sql.NVarChar, nombreCategoria)
      .query("SELECT id_categoria FROM CATEGORIA WHERE nombre_categoria = @nombre");
    if (existente.recordset[0]) return existente.recordset[0].id_categoria;

    const creada = await pool
      .request()
      .input("nombre", sql.NVarChar, nombreCategoria)
      .query("INSERT INTO CATEGORIA (nombre_categoria) OUTPUT INSERTED.id_categoria VALUES (@nombre)");
    return creada.recordset[0].id_categoria;
  }

  async obtenerMovimientos(usuarioId: number): Promise<Movimiento[]> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .query(`${SELECT_BASE} WHERE m.id_usuario = @usuarioId ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC`);
    return result.recordset.map(mapRow);
  }

  async obtenerMovimientosPorTipo(usuarioId: number, tipo: "ingreso" | "egreso"): Promise<Movimiento[]> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("tipo", sql.NVarChar, tipo)
      .query(`${SELECT_BASE} WHERE m.id_usuario = @usuarioId AND m.tipo_movimiento = @tipo ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC`);
    return result.recordset.map(mapRow);
  }

  async obtenerTodosMovimientos(): Promise<Movimiento[]> {
    // Solo para el dashboard de admin: todos los movimientos, de todos los usuarios
    const pool = await getPool();
    const result = await pool.request().query(`${SELECT_BASE} ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC`);
    return result.recordset.map(mapRow);
  }

  async agregarMovimiento(usuarioId: number, datos: NuevoMovimiento): Promise<Movimiento> {
    const pool = await getPool();
    const idCategoria = await this.obtenerOCrearCategoria(pool, datos.categoria);

    const insertado = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("idCategoria", sql.Int, idCategoria)
      .input("monto", sql.Decimal(10, 2), datos.monto)
      .input("descripcion", sql.NVarChar, datos.descripcion)
      .input("fecha", sql.DateTime2, datos.fecha)
      .input("tipo", sql.NVarChar, datos.tipo)
      .query(`
        INSERT INTO MOVIMIENTO (id_usuario, id_categoria, monto, tipo_movimiento, descripcion, fecha_movimiento)
        OUTPUT INSERTED.id_movimiento
        VALUES (@usuarioId, @idCategoria, @monto, @tipo, @descripcion, @fecha)
      `);

    const nuevoId = insertado.recordset[0].id_movimiento;
    const fila = await pool
      .request()
      .input("id", sql.Int, nuevoId)
      .query(`${SELECT_BASE} WHERE m.id_movimiento = @id`);
    return mapRow(fila.recordset[0]);
  }

  async eliminarMovimiento(usuarioId: number, id: number): Promise<boolean> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("usuarioId", sql.Int, usuarioId)
      .query("DELETE FROM MOVIMIENTO WHERE id_movimiento = @id AND id_usuario = @usuarioId");
    return (result.rowsAffected[0] ?? 0) > 0;
  }

  async obtenerResumen(usuarioId: number, fechaInicio: string, fechaFin: string) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("usuarioId", sql.Int, usuarioId)
      .input("inicio", sql.Date, fechaInicio)
      .input("fin", sql.Date, fechaFin)
      .query(`
        ${SELECT_BASE}
        WHERE m.id_usuario = @usuarioId
          AND CAST(m.fecha_movimiento AS DATE) >= @inicio
          AND CAST(m.fecha_movimiento AS DATE) <= @fin
        ORDER BY m.fecha_movimiento DESC
      `);

    const filtrados = result.recordset.map(mapRow);
    let totalIngresos = 0;
    let totalEgresos = 0;
    filtrados.forEach((mov) => {
      if (mov instanceof Ingreso) totalIngresos += mov.getMonto();
      else if (mov instanceof Egreso) totalEgresos += mov.getMonto();
    });

    return {
      ingresosTotales: totalIngresos,
      egresosTotales: totalEgresos,
      diferencia: totalIngresos - totalEgresos,
      movimientosDelPeriodo: filtrados,
    };
  }
}

export const movimientoManager = new MovimientoManager();