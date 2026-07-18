import { API_URL } from "./api";
import { Articulo } from "../models/Articulo";

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ---- Lectura pública (usuario) ----

export async function obtenerArticulos(): Promise<Articulo[]> {
  const response = await fetch(`${API_URL}/educativo`);
  if (!response.ok) throw new Error("No se pudieron obtener los artículos");
  return response.json();
}

export async function obtenerArticuloPorId(id: number): Promise<Articulo> {
  const response = await fetch(`${API_URL}/educativo/${id}`);
  if (!response.ok) throw new Error("No se pudo obtener el artículo");
  return response.json();
}

// ---- Administración (requiere sesión de administrador) ----

export async function adminObtenerArticulos(token: string): Promise<Articulo[]> {
  const response = await fetch(`${API_URL}/educativo`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error("No se pudieron obtener los artículos");
  return response.json();
}

export async function adminCrearArticulo(
  token: string,
  datos: Omit<Articulo, "id">
): Promise<Articulo> {
  const response = await fetch(`${API_URL}/educativo`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo publicar el artículo");
  }
  return response.json();
}

export async function adminActualizarArticulo(
  token: string,
  id: number,
  datos: Partial<Omit<Articulo, "id">>
): Promise<Articulo> {
  const response = await fetch(`${API_URL}/educativo/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo actualizar el artículo");
  }
  return response.json();
}

export async function adminEliminarArticulo(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/educativo/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo eliminar el artículo");
  }
}