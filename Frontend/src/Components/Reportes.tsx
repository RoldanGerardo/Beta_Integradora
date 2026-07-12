import { useState, useEffect, useMemo } from "react";
import type { ElementType } from "react";
import {
  Mail, HelpCircle, TrendingUp, TrendingDown, Loader2, AlertCircle,
  RefreshCw, Wallet, GraduationCap, Briefcase, Gift, Tag,
  Utensils, Bus, School, Ticket, Shirt,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { obtenerInforme, InformePeriodo } from "../services/api";
import { C } from "./theme.ts";

type Props = {
  onNavigate: (vista: string) => void;
  filtroInicial?: "quincenal" | "mensual";
};

const categoriaIconos: Record<string, ElementType> = {
  Becas: GraduationCap,
  Mesada: Wallet,
  Trabajo: Briefcase,
  Regalos: Gift,
  Ventas: Tag,
  Comida: Utensils,
  Transporte: Bus,
  Escuela: School,
  Salidas: Ticket,
  Ropa: Shirt,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatFechaDisplay(fecha: string): string {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

function obtenerRangoMensual(): { inicio: string; fin: string } {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  return { inicio: formatDate(inicio), fin: formatDate(fin) };
}

function obtenerRangoQuincenal(): { inicio: string; fin: string } {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth();
  const dia = hoy.getDate();

  if (dia <= 15) {
    return {
      inicio: formatDate(new Date(year, month, 1)),
      fin: formatDate(new Date(year, month, 15)),
    };
  }
  const ultimoDia = new Date(year, month + 1, 0).getDate();
  return {
    inicio: formatDate(new Date(year, month, 16)),
    fin: formatDate(new Date(year, month, ultimoDia)),
  };
}

export default function Reportes({ onNavigate, filtroInicial }: Props) {
  const [filtro, setFiltro] = useState<"quincenal" | "mensual">(filtroInicial ?? "mensual");
  const [informe, setInforme] = useState<InformePeriodo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rango = useMemo(
    () => (filtro === "quincenal" ? obtenerRangoQuincenal() : obtenerRangoMensual()),
    [filtro]
  );

  const cargarInforme = () => {
    setCargando(true);
    setError(null);
    obtenerInforme(rango.inicio, rango.fin)
      .then((data) => setInforme(data))
      .catch(() => setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo."))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    obtenerInforme(rango.inicio, rango.fin)
      .then((data) => activo && setInforme(data))
      .catch(() => activo && setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo."))
      .finally(() => activo && setCargando(false));
    return () => { activo = false; };
  }, [rango.inicio, rango.fin]);

  const ingresos = informe?.ingresosTotales ?? 0;
  const egresos = informe?.egresosTotales ?? 0;
  const diferencia = informe?.diferencia ?? 0;
  const movimientos = informe?.movimientosDelPeriodo ?? [];

  const maxValor = Math.max(ingresos, egresos, Math.abs(diferencia), 1);

  const movimientosOrdenados = useMemo(
    () => [...movimientos].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
    [movimientos]
  );

  const resumenTexto = cargando
    ? "Calculando tu resumen del periodo..."
    : `usuario_67 gastó $${egresos.toFixed(2)} mientras que sus ingresos fueron de $${ingresos.toFixed(2)}, por lo que el usuario ha gastado ${
        diferencia >= 0 ? "menos" : "más"
      } que sus ingresos en este periodo.`;

  const consejo =
    diferencia < 0
      ? "⚠️ Estás gastando más de lo que ingresa. Revisa tus categorías con más movimientos y recorta lo que no sea esencial."
      : diferencia === 0
      ? "⚖️ Vas exactamente a la par. Intenta apartar un pequeño porcentaje de tu próximo ingreso para empezar a ahorrar."
      : "💪 ¡Vas bien! Estás gastando menos de lo que ingresa. Considera mover ese excedente a tu meta de ahorro.";

  return (
    <div className="flex-1 min-h-screen flex flex-col" style={{ background: C.cream, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes popIn { from { opacity:0; transform: scale(.95); } to { opacity:1; transform: scale(1); } }`}</style>

      <header className="flex items-center justify-between px-8 py-4 flex-shrink-0" style={{ background: "white", borderBottom: "2px solid rgba(18,38,58,0.06)" }}>
        <div className="px-5 py-1.5 rounded-full text-[13px] font-extrabold flex items-center gap-2 border-2" style={{ background: C.sun, color: C.navy, borderColor: C.navy }}>📊 Sección de reportes</div>
        <div className="flex items-center gap-2">
          <button onClick={cargarInforme} className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95" style={{ background: "rgba(250,190,11,0.14)" }} title="Actualizar">
            <RefreshCw size={14} color={C.navy} />
          </button>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white text-sm" style={{ background: C.blue }}>U</div>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 flex flex-col gap-5 overflow-y-auto max-w-6xl w-full mx-auto">
        {error && (
          <div className="rounded-2xl p-3 flex items-center gap-2 text-[12px] font-semibold border-2" style={{ background: "#FEE2E2", color: "#B91C1C", borderColor: "#F87171" }}>
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError(null)} className="ml-auto font-bold hover:opacity-70">✕</button>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {(["quincenal", "mensual"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className="px-6 py-2 rounded-full font-extrabold uppercase text-[12px] transition-colors duration-150 border-2"
                style={{ background: filtro === f ? C.blue : "white", color: filtro === f ? "white" : C.blue, borderColor: C.blue }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-bold" style={{ color: C.slate }}>{formatFechaDisplay(rango.inicio)} — {formatFechaDisplay(rango.fin)}</div>
        </div>

        <div className="bg-white rounded-[28px] p-6 flex flex-col border-[3px]" style={{ borderColor: "rgba(18,38,58,0.1)", minHeight: 260 }}>
          <h3 className="font-extrabold text-[15px] mb-4" style={{ color: C.navy }}>Historial de ingresos y egresos</h3>
          <div className="space-y-2.5 h-56 overflow-y-auto pr-1">
            {cargando ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 size={24} style={{ color: C.slate, animation: "spin 1s linear infinite" }} />
                <p className="text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Cargando movimientos...</p>
              </div>
            ) : movimientosOrdenados.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <Wallet size={28} color="#DCEBFB" />
                <p className="text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>No hay movimientos registrados en este periodo.</p>
              </div>
            ) : (
              movimientosOrdenados.map((mov, idx) => {
                const Icono = categoriaIconos[mov.categoria] ?? Tag;
                const esIngreso = mov.tipo === "ingreso";
                return (
                  <div key={mov.id ?? idx} className="p-3 rounded-2xl flex items-center justify-between transition-transform duration-150 hover:-translate-y-0.5 border-2" style={{ background: esIngreso ? "#E4F7E1" : "#FDECDD", borderColor: esIngreso ? `${C.moss}55` : `${C.mandarin}55` }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}>
                        <Icono size={16} color={esIngreso ? "#3D7A41" : "#AE6D21"} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: C.navy }}>{mov.descripcion}</p>
                        <p className="text-[10px]" style={{ color: C.slate }}>{mov.categoria} · {formatFechaDisplay(mov.fecha)}</p>
                      </div>
                    </div>
                    <div className="font-bold text-[14px] tabular-nums flex-shrink-0" style={{ color: esIngreso ? "#3D7A41" : "#AE6D21" }}>
                      {esIngreso ? "+" : "-"}${Number(mov.monto).toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[28px] p-6 border-[3px]" style={{ borderColor: "rgba(18,38,58,0.1)" }}>
            <h3 className="font-extrabold text-[17px] mb-5" style={{ color: C.blue }}>Desempeño</h3>
            <div className="space-y-4">
              {[
                { label: "Ingresos totales", valor: ingresos, color: C.moss, bg: "#E4F7E1", text: "#3D7A41" },
                { label: "Egresos totales", valor: egresos, color: C.mandarin, bg: "#FDECDD", text: "#AE6D21" },
                { label: "Diferencia", valor: Math.abs(diferencia), color: diferencia >= 0 ? C.turquoise : "#F87171", bg: diferencia >= 0 ? "#DDF6F7" : "#FEE2E2", text: diferencia >= 0 ? "#0E7490" : "#B91C1C" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] font-bold" style={{ color: C.navy }}>{b.label}</span>
                    <span className="text-[13px] font-bold" style={{ color: b.text }}>${b.valor.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-3.5 rounded-full overflow-hidden" style={{ background: b.bg }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: cargando ? "0%" : `${Math.min(100, (b.valor / maxValor) * 100)}%`, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-6 flex flex-col border-[3px]" style={{ borderColor: "rgba(18,38,58,0.1)" }}>
            <h3 className="font-extrabold text-[17px] mb-4" style={{ color: C.blue }}>Resumen</h3>
            <p className="text-[13px] leading-relaxed flex-1" style={{ color: C.navy, fontFamily: "'Inter',sans-serif" }}>{resumenTexto}</p>
            <div className="flex items-center gap-2 mt-3">
              {diferencia >= 0 ? <TrendingUp size={16} color={C.moss} /> : <TrendingDown size={16} color={C.mandarin} />}
              <span className="text-[11px] font-bold" style={{ color: C.slate }}>{movimientos.length} movimiento{movimientos.length === 1 ? "" : "s"} en el periodo</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] p-5 flex items-center gap-3 border-[3px]" style={{ background: "#DCEBFB", borderColor: C.blue }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.sun }}>
            <TrendingUp size={18} color={C.navy} />
          </div>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: C.navy, fontFamily: "'Inter',sans-serif" }}>{consejo}</p>
        </div>
      </div>

      <footer className="flex items-center justify-between px-8 py-3 flex-shrink-0" style={{ background: "white", borderTop: "2px solid rgba(18,38,58,0.06)" }}>
        <a href="mailto:beta@example.com" className="flex items-center gap-2 text-[12px] font-bold transition-colors duration-150 hover:opacity-70" style={{ color: C.slate }}>
          <Mail size={14} /> beta@example.com
        </a>
        <div className="flex flex-col items-center">
          <BetaLogo size={22} />
          <span className="text-[10px] font-bold mt-0.5" style={{ color: C.blue }}>BETA: Finanzas para los Jóvenes</span>
        </div>
        <button onClick={() => onNavigate("contacto")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95" style={{ border: `2px solid ${C.navy}20`, color: C.slate }} title="Ayuda y Soporte">
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}