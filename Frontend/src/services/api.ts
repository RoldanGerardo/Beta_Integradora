import { Movimiento } from "../models/Movimiento";
export const API_URL = "http://localhost:3000";

// 🛠️ Función auxiliar corregida para extraer el token del JSON de sesión
function obtenerHeadersSeguros(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    ...extraHeaders
  };

  try {
    // Buscamos tu clave real de sesión
    const guardada = localStorage.getItem("beta_session"); 
    
    if (guardada) {
      const sesion = JSON.parse(guardada);
      // Si el objeto tiene el token, lo inyectamos en la cabecera
      if (sesion && sesion.token) {
        headers["Authorization"] = `Bearer ${sesion.token}`;
      }
    }
  } catch (error) {
    console.error("Error al parsear la sesión desde localStorage:", error);
  }

  return headers;
}

// 1. GET: Obtener movimientos de forma privada
export async function obtenerMovimientos(
  tipo?: "ingreso" | "egreso"
): Promise<Movimiento[]> {
  const url = tipo
    ? `${API_URL}/movimientos?tipo=${tipo}`
    : `${API_URL}/movimientos`;

  const response = await fetch(url, {
    method: "GET",
    headers: obtenerHeadersSeguros()
  });
  
  if (!response.ok) throw new Error("No se pudieron obtener los movimientos");
  return response.json();
}

// 2. POST: Crear movimiento ligado al usuario autenticado
export async function crearMovimiento(
  datos: Omit<Movimiento, "id">
): Promise<Movimiento> {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: obtenerHeadersSeguros({ "Content-Type": "application/json" }),
    body: JSON.stringify(datos),
  });
  
  if (!response.ok) throw new Error("No se pudo guardar el movimiento");
  return response.json();
}

// 3. DELETE: Eliminar un movimiento asegurando que sea propiedad del usuario
export async function eliminarMovimiento(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/movimientos/${id}`, {
    method: "DELETE",
    headers: obtenerHeadersSeguros()
  });
  
  if (!response.ok) throw new Error("No se pudo eliminar el movimiento");
}

export interface InformePeriodo {
  ingresosTotales: number;
  egresosTotales: number;
  diferencia: number; 
  movimientosDelPeriodo: Movimiento[];
}

// Forma cruda en la que responde el backend (obtenerResumen en movimientosManager.ts)
interface RespuestaInformeBackend {
  fechaInicio: string;
  fechaFin: string;
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  cantidadMovimientos: number;
  porCategoria: { categoria: string; tipo: string; total: number }[];
  movimientos: Movimiento[];
}

// 4. GET: Obtener informe financiero privado
export async function obtenerInforme(
  inicio: string,
  fin: string
): Promise<InformePeriodo> {
  const response = await fetch(
    `${API_URL}/informes?inicio=${inicio}&fin=${fin}`,
    {
      method: "GET",
      headers: obtenerHeadersSeguros()
    }
  );

  if (!response.ok) throw new Error("No se pudo obtener el informe");

  const data: RespuestaInformeBackend = await response.json();

  // Traducimos los nombres del backend a los que espera Reportes.tsx
  return {
    ingresosTotales: Number(data.totalIngresos ?? 0),
    egresosTotales: Number(data.totalEgresos ?? 0),
    diferencia: Number(data.balance ?? 0),
    movimientosDelPeriodo: data.movimientos ?? [],
  };
}