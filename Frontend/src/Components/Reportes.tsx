import { useState, useEffect, useMemo } from "react";
import {
  Mail, HelpCircle, TrendingUp, TrendingDown, Loader2, AlertCircle,
  RefreshCw, Wallet, GraduationCap, Briefcase, Gift, Tag,
  Utensils, Bus, School, Ticket, Shirt,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { Movimiento } from "../models/Movimiento";
import { obtenerInforme, InformePeriodo } from "../services/api";

type Props = {
  onNavigate: (vista: string) => void;
  filtroInicial?: "quincenal" | "mensual";
};

const categoriaIconos: Record<string, React.ElementType> = {
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
  const [filtro, setFiltro] = useState<"quincenal" | "mensual">(
    filtroInicial ?? "mensual"
  );
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
      .catch(() =>
        setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.")
      )
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
    <div
      className="flex-1 min-h-screen flex flex-col"
      style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}
    >
      {/* ── TOP BAR ── */}
      <header
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ background: "#F4EDEA", borderBottom: "1px solid rgba(18,38,58,0.07)" }}
      >
        <div
          className="px-5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-2"
          style={{ background: "#FABE0B", color: "#12263A" }}
        >
          BIENVENIDO A LA SECCIÓN DE REPORTES
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cargarInforme}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: "rgba(18,38,58,0.06)" }}
            title="Actualizar"
          >
            <RefreshCw size={14} style={{ color: "#12263A" }} />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: "#405FFA" }}
          >
            U
          </div>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 flex flex-col gap-5 overflow-y-auto max-w-5xl w-full mx-auto">
        {error && (
          <div
            className="rounded-xl p-3 flex items-center gap-2 text-[12px] font-semibold"
            style={{ background: "#FEE2E2", color: "#B91C1C" }}
          >
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto font-bold hover:opacity-70">
              ✕
            </button>
          </div>
        )}

        {/* Selector de filtro */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {(["quincenal", "mensual"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className="px-6 py-2 rounded-full font-bold uppercase text-[12px] transition-colors duration-150"
                style={{
                  background: filtro === f ? "#405FFA" : "white",
                  color: filtro === f ? "white" : "#405FFA",
                  border: "1px solid rgba(64,95,250,0.25)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-semibold" style={{ color: "#668EA5" }}>
            {formatFechaDisplay(rango.inicio)} — {formatFechaDisplay(rango.fin)}
          </div>
        </div>

        {/* Historial del periodo */}
        <div
          className="bg-white rounded-2xl p-6 flex flex-col"
          style={{ border: "1px solid rgba(18,38,58,0.06)", minHeight: 260 }}
        >
          <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: "#12263A" }}>
            Historial de ingresos y egresos
          </h3>
          <div className="space-y-2.5 h-56 overflow-y-auto pr-1">
            {cargando ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 size={24} style={{ color: "#668EA5", animation: "spin 1s linear infinite" }} />
                <p className="text-[12px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
                  Cargando movimientos...
                </p>
              </div>
            ) : movimientosOrdenados.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <Wallet size={28} style={{ color: "#BDE2F2" }} />
                <p className="text-[12px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
                  No hay movimientos registrados en este periodo.
                </p>
              </div>
            ) : (
              movimientosOrdenados.map((mov, idx) => {
                const Icono = categoriaIconos[mov.categoria] ?? Tag;
                const esIngreso = mov.tipo === "ingreso";
                return (
                  <div
                    key={mov.id ?? idx}
                    className="p-3 rounded-xl flex items-center justify-between transition-transform duration-150 hover:-translate-y-0.5"
                    style={{ background: esIngreso ? "#E6FBDA" : "#FFF3E0" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "white" }}
                      >
                        <Icono size={16} style={{ color: esIngreso ? "#707D4E" : "#AE6D21" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: "#12263A" }}>
                          {mov.descripcion}
                        </p>
                        <p className="text-[10px]" style={{ color: "#668EA5" }}>
                          {mov.categoria} · {formatFechaDisplay(mov.fecha)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="font-bold text-[14px] tabular-nums flex-shrink-0"
                      style={{ color: esIngreso ? "#707D4E" : "#AE6D21" }}
                    >
                      {esIngreso ? "+" : "-"}${Number(mov.monto).toFixed(2)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desempeño + Resumen */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Desempeño */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: "1px solid rgba(18,38,58,0.06)" }}
          >
            <h3 className="font-bold text-[17px] mb-5" style={{ color: "#405FFA" }}>
              Desempeño
            </h3>
            <div className="space-y-4">
              {[
                { label: "Ingresos totales", valor: ingresos, color: "#84D175", bg: "#E6FBDA", text: "#707D4E" },
                { label: "Egresos totales", valor: egresos, color: "#F8910C", bg: "#FFF3E0", text: "#AE6D21" },
                {
                  label: "Diferencia",
                  valor: Math.abs(diferencia),
                  color: diferencia >= 0 ? "#26CBD1" : "#F87171",
                  bg: diferencia >= 0 ? "#E0FBFC" : "#FEE2E2",
                  text: diferencia >= 0 ? "#0E7490" : "#B91C1C",
                },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[12px] font-bold" style={{ color: "#12263A" }}>
                      {b.label}
                    </span>
                    <span className="text-[13px] font-bold" style={{ color: b.text }}>
                      ${b.valor.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: b.bg }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: cargando ? "0%" : `${Math.min(100, (b.valor / maxValor) * 100)}%`,
                        background: b.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col"
            style={{ border: "1px solid rgba(18,38,58,0.06)" }}
          >
            <h3 className="font-bold text-[17px] mb-4" style={{ color: "#405FFA" }}>
              Resumen
            </h3>
            <p
              className="text-[13px] leading-relaxed flex-1"
              style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}
            >
              {resumenTexto}
            </p>
            <div className="flex items-center gap-2 mt-3">
              {diferencia >= 0 ? (
                <TrendingUp size={16} style={{ color: "#84D175" }} />
              ) : (
                <TrendingDown size={16} style={{ color: "#F8910C" }} />
              )}
              <span className="text-[11px] font-semibold" style={{ color: "#668EA5" }}>
                {movimientos.length} movimiento{movimientos.length === 1 ? "" : "s"} en el periodo
              </span>
            </div>
          </div>
        </div>

        {/* Consejo */}
        <div
          className="rounded-2xl p-5 flex items-center gap-3"
          style={{ background: "#BDE2F2", border: "1px solid rgba(102,142,165,0.25)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FABE0B" }}
          >
            <TrendingUp size={18} style={{ color: "#12263A" }} />
          </div>
          <p
            className="text-[12px] font-semibold leading-relaxed"
            style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}
          >
            {consejo}
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ background: "#BDE2F2", borderTop: "1px solid rgba(18,38,58,0.08)" }}
      >
        <button
          className="flex items-center gap-2 text-[12px] font-bold transition-colors duration-150"
          style={{ color: "#668EA5" }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = "#405FFA")}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = "#668EA5")}
        >
          <Mail size={14} />
          beta@example.com
        </button>
        <div className="flex flex-col items-center">
          <BetaLogo size={22} />
          <span className="text-[10px] font-bold mt-0.5" style={{ color: "#405FFA" }}>
            BETA: Finanzas para los Jóvenes
          </span>
        </div>
        <button
          onClick={() => onNavigate("contacto")}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ border: "2px solid rgba(18,38,58,0.18)", color: "#668EA5" }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#12263A";
            (e.currentTarget as HTMLElement).style.color = "white";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#668EA5";
          }}
          title="Ayuda y Soporte"
        >
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}