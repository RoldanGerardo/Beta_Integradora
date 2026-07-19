import fs from "node:fs";
import path from "node:path";

// Guardamos aquí, fuera de la BD, qué usuarios son administradores y
// cuáles están desactivados. La tabla USUARIO no tiene columnas para
// esto y no queremos alterar su estructura, así que usamos un archivo
// JSON persistente en disco como complemento de la base de datos.
const RUTA_ARCHIVO = path.resolve(process.cwd(), "roles-store.json");

interface RolesData {
  admins: string[];       // correos electrónicos con rol admin
  inactivos: number[];    // ids de USUARIO marcados como inactivos
}

function leer(): RolesData {
  try {
    if (!fs.existsSync(RUTA_ARCHIVO)) {
      const inicial: RolesData = { admins: [], inactivos: [] };
      fs.writeFileSync(RUTA_ARCHIVO, JSON.stringify(inicial, null, 2));
      return inicial;
    }
    const contenido = fs.readFileSync(RUTA_ARCHIVO, "utf-8");
    return JSON.parse(contenido) as RolesData;
  } catch (error) {
    console.error("Error al leer roles-store.json:", error);
    return { admins: [], inactivos: [] };
  }
}

function guardar(data: RolesData): void {
  try {
    fs.writeFileSync(RUTA_ARCHIVO, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al guardar roles-store.json:", error);
  }
}

export function esAdmin(correo: string): boolean {
  const data = leer();
  return data.admins.includes(correo.toLowerCase());
}

export function marcarComoAdmin(correo: string): void {
  const data = leer();
  const email = correo.toLowerCase();
  if (!data.admins.includes(email)) {
    data.admins.push(email);
    guardar(data);
  }
}

export function quitarAdmin(correo: string): void {
  const data = leer();
  const email = correo.toLowerCase();
  data.admins = data.admins.filter((a) => a !== email);
  guardar(data);
}

export function estaActivo(idUsuario: number): boolean {
  const data = leer();
  return !data.inactivos.includes(idUsuario);
}

export function establecerActivo(idUsuario: number, activo: boolean): void {
  const data = leer();
  if (activo) {
    data.inactivos = data.inactivos.filter((id) => id !== idUsuario);
  } else if (!data.inactivos.includes(idUsuario)) {
    data.inactivos.push(idUsuario);
  }
  guardar(data);
}

export function eliminarRegistro(idUsuario: number, correo: string): void {
  const data = leer();
  data.inactivos = data.inactivos.filter((id) => id !== idUsuario);
  data.admins = data.admins.filter((a) => a !== correo.toLowerCase());
  guardar(data);
}