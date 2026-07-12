import { API_URL } from "./api";
import { Articulo } from "../models/Articulo";

export async function obtenerArticulos(): Promise<Articulo[]> {
  const response = await fetch(`${API_URL}/educativo`);
  if (!response.ok) throw new Error("No se pudieron obtener los artículos");
  return response.json();
}

export async function publicarArticulo(
  datos: Omit<Articulo, "id">
): Promise<Articulo> {
  const response = await fetch(`${API_URL}/educativo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("No se pudo publicar el artículo");
  const data = await response.json();
  return data.articulo;
}