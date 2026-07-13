import { API_URL } from "./api";

export type Rol = "usuario" | "admin";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: Rol;
  activo: boolean;
  fechaRegistro: string;
}

export interface Sesion {
  token: string;
  usuario: UsuarioSesion;
}

export async function login(identificador: string, password: string): Promise<Sesion> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identificador, password }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo iniciar sesión");
  }
  return response.json();
}

// ---- Admin: Usuarios ----
function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function adminObtenerUsuarios(token: string): Promise<UsuarioSesion[]> {
  const response = await fetch(`${API_URL}/admin/usuarios`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error("No se pudieron obtener los usuarios");
  return response.json();
}

export async function adminCrearUsuario(
  token: string,
  datos: { nombre: string; username: string; email: string; password: string; rol: Rol }
): Promise<UsuarioSesion> {
  const response = await fetch(`${API_URL}/admin/usuarios`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo crear el usuario");
  }
  return response.json();
}

export async function adminActualizarUsuario(
  token: string,
  id: number,
  datos: Partial<{ nombre: string; username: string; email: string; rol: Rol }>
): Promise<UsuarioSesion> {
  const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("No se pudo actualizar el usuario");
  return response.json();
}

export async function adminCambiarEstado(token: string, id: number, activo: boolean): Promise<UsuarioSesion> {
  const response = await fetch(`${API_URL}/admin/usuarios/${id}/estado`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ activo }),
  });
  if (!response.ok) throw new Error("No se pudo cambiar el estado");
  return response.json();
}

export async function adminEliminarUsuario(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/usuarios/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("No se pudo eliminar el usuario");
}

export interface DashboardStats {
  totalUsuarios: number;
  usuariosActivos: number;
  totalMovimientos: number;
  ultimosMovimientos: { id: number; descripcion: string; monto: number; tipo: string; fecha: string }[];
}

export async function adminObtenerDashboard(token: string): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/admin/dashboard`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error("No se pudo obtener el dashboard");
  return response.json();
}