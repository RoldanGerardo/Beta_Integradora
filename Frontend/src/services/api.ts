/* ─────────────────────────────────────────────────
   src/services/api.ts
   Cliente central para hablar con el backend de BETA.
   Todas las pantallas de movimientos usan estas
   funciones en lugar de llamar fetch() directamente.
───────────────────────────────────────────────── */
import { Movimiento } from "../models/Movimiento";

export const API_URL = "http://localhost:3000";

export async function obtenerMovimientos(
  tipo?: "ingreso" | "egreso"
): Promise<Movimiento[]> {
  const url = tipo
    ? `${API_URL}/movimientos?tipo=${tipo}`
    : `${API_URL}/movimientos`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudieron obtener los movimientos");
  return response.json();
}

export async function crearMovimiento(
  datos: Omit<Movimiento, "id">
): Promise<Movimiento> {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("No se pudo guardar el movimiento");
  return response.json();
}

export async function eliminarMovimiento(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/movimientos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("No se pudo eliminar el movimiento");
}