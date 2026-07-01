// src/models/Movimiento.ts
export interface Movimiento {
  id?: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: "ingreso" | "egreso";
  categoria: string;
}