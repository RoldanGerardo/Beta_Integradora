import type { MetaAhorro } from "../models/MetaAhorro";

// Por ahora persistimos en localStorage (equivalente a un "arreglo" que
// sobrevive a un refresh de página). Las firmas de estas funciones son
// idénticas al patrón que ya usa src/services/api.ts (async + Promise),
// así que cuando el backend exponga un endpoint real, por ejemplo:
//   GET    /meta-ahorro
//   POST   /meta-ahorro
//   DELETE /meta-ahorro
// solo hay que reemplazar el cuerpo de cada función por un fetch a
// `${API_URL}/meta-ahorro`, sin tocar Dashboard.tsx ni MetaAhorroModal.tsx.

const STORAGE_KEY = "beta_meta_ahorro";

export async function obtenerMetaAhorro(): Promise<MetaAhorro | null> {
  return new Promise((resolve) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    resolve(raw ? (JSON.parse(raw) as MetaAhorro) : null);
  });
}

export async function guardarMetaAhorro(
  datos: Omit<MetaAhorro, "id" | "fechaCreacion">
): Promise<MetaAhorro> {
  return new Promise((resolve) => {
    const existente = localStorage.getItem(STORAGE_KEY);
    const previa = existente ? (JSON.parse(existente) as MetaAhorro) : null;

    const meta: MetaAhorro = {
      id: previa?.id ?? Date.now(),
      fechaCreacion: previa?.fechaCreacion ?? new Date().toISOString(),
      ...datos,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
    resolve(meta);
  });
}

export async function eliminarMetaAhorro(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.removeItem(STORAGE_KEY);
    resolve();
  });
}