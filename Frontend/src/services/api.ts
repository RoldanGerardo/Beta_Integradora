import { Movimiento } from "../models/Movimiento";
export const API_URL = "http://localhost:3000";

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function obtenerMovimientos(
  token: string,
  tipo?: "ingreso" | "egreso"
): Promise<Movimiento[]> {
  const url = tipo
    ? `${API_URL}/movimientos?tipo=${tipo}`
    : `${API_URL}/movimientos`;

  const response = await fetch(url, { headers: authHeaders(token) });
  if (!response.ok) throw new Error("No se pudieron obtener los movimientos");
  return response.json();
}

export async function crearMovimiento(
  token: string,
  datos: Omit<Movimiento, "id">
): Promise<Movimiento> {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("No se pudo guardar el movimiento");
  return response.json();
}

export async function eliminarMovimiento(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/movimientos/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("No se pudo eliminar el movimiento");
}

export interface InformePeriodo {
  ingresosTotales: number;
  egresosTotales: number;
  diferencia: number;
  movimientosDelPeriodo: Movimiento[];
}

export async function obtenerInforme(
  token: string,
  inicio: string,
  fin: string
): Promise<InformePeriodo> {
  const response = await fetch(
    `${API_URL}/informes?inicio=${inicio}&fin=${fin}`,
    { headers: authHeaders(token) }
  );
  if (!response.ok) throw new Error("No se pudo obtener el informe");
  return response.json();
}