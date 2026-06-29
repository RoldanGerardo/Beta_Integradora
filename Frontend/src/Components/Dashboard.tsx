/* ─────────────────────────────────────────────────
   src/Components/Dashboard.tsx
   Panel principal del usuario autenticado en BETA
   ───────────────────────────────────────────────── */
import { Mail, HelpCircle, TrendingUp, TrendingDown, ArrowUpRight, BookOpen, CheckCircle, Circle } from "lucide-react";
import BetaLogo from "./BetaLogo";

type DashboardProps = {
  onNavigate?: (vista: string) => void;
};

const movCards = [
  {
    label: "Ingresos del mes",
    amount: "$3,200.00",
    change: "+12%",
    up: true,
    bg: "#E6FBDA",
    border: "#84D175",
    color: "#707D4E",
    Icon: TrendingUp,
    // img: "/assets/billetes-ilu.svg"  ← reemplaza cuando tengas el SVG
  },
  {
    label: "Egresos del mes",
    amount: "$2,733.00",
    change: "-8%",
    up: false,
    bg: "#FFF3E0",
    border: "#F8910C",
    color: "#AE6D21",
    Icon: TrendingDown,
    // img: "/assets/monedas-bajan-ilu.svg"
  },
  {
    label: "Últimos movimientos",
    amount: "14",
    change: "transacciones",
    up: true,
    bg: "#BDE2F2",
    border: "#668EA5",
    color: "#12263A",
    Icon: ArrowUpRight,
    // img: "/assets/historial-ilu.svg"
  },
];

const quizzes = [
  { done: true,  label: "1. Salud Financiera Básica" },
  { done: true,  label: "2. ¿Qué tanto sabes del Ahorro?" },
  { done: false, label: "3. Cuestionario Semanal: Presupuestos" },
  { done: false, label: "4. Mitos del Crédito Joven" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const savingPct = 46;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}
    >
      {/* ── TOP BAR ── */}
      <header
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ background: "#F4EDEA", borderBottom: "1px solid rgba(18,38,58,0.07)" }}
      >
        <div
          className="px-5 py-1.5 rounded-full text-[13px] font-bold"
          style={{ background: "#FABE0B", color: "#12263A" }}
        >
          ¡Bienvenido de nuevo, <span style={{ color: "#AE6D21" }}>usuario_67</span>! 👋
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(18,38,58,0.06)" }}
            title="Notificaciones"
          >
            <span className="text-[16px]">🔔</span>
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: "#405FFA" }}
          >
            U
          </div>
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 px-8 py-6 flex flex-col gap-5 overflow-y-auto max-w-5xl w-full mx-auto">

        {/* ── META DE AHORRO ── */}
        <div
          className="rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden"
          style={{ background: "#BDE2F2", border: "1px solid rgba(102,142,165,0.25)" }}
        >
          {/* Avatar placeholder */}
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-sm z-10"
            style={{ background: "#405FFA" }}
          >
            U
            {/* Reemplaza con tu imagen:
            <img src="/assets/avatar.png" className="w-full h-full rounded-full object-cover" /> */}
          </div>

          <div className="flex-1 z-10">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#668EA5" }}>
                  Meta de ahorro
                </div>
                <div className="text-[18px] font-bold" style={{ color: "#12263A" }}>
                  $467.00 <span className="text-[13px] font-normal text-[#668EA5]">/ $1,000.00</span>
                </div>
              </div>
              <div
                className="text-[22px] font-bold"
                style={{ color: "#405FFA" }}
              >
                {savingPct}%
              </div>
            </div>
            {/* Barra de progreso */}
            <div
              className="w-full rounded-full h-3 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${savingPct}%`,
                  background: "linear-gradient(90deg, #405FFA, #26CBD1)",
                }}
              />
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: "#668EA5" }}>
              ¡Vas muy bien! Faltan <strong style={{ color: "#12263A" }}>$533.00</strong> para tu meta 🎯
            </div>
          </div>

          {/* Decoración fondo */}
          <div
            className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full pointer-events-none"
            style={{ background: "#405FFA", opacity: .07 }}
          />
        </div>

        {/* ── TARJETAS DE MOVIMIENTOS ── */}
        <div className="grid grid-cols-3 gap-4">
          {movCards.map(({ label, amount, change, up, bg, border, color, Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-2 cursor-pointer transition-transform duration-150 hover:-translate-y-1"
              style={{ background: bg, border: `1px solid ${border}30` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${border}22` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: up ? "rgba(132,209,117,0.25)" : "rgba(248,145,12,0.20)",
                    color: up ? "#707D4E" : "#AE6D21",
                  }}
                >
                  {change}
                </span>
              </div>
              <div className="text-[20px] font-bold" style={{ color: "#12263A" }}>{amount}</div>
              <div className="text-[11px] font-medium" style={{ color }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── FILA INFERIOR: Consejo + Cuestionarios ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Consejo del día */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{ background: "#E6FBDA", border: "1px solid rgba(132,209,117,0.30)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[16px]"
                style={{ background: "#84D17522" }}
              >
                💡
              </div>
              <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#707D4E" }}>
                Consejo del día
              </div>
            </div>
            <p
              className="text-[13px] leading-relaxed"
              style={{ fontFamily: "'Inter',sans-serif", color: "#12263A" }}
            >
              "El interés compuesto es como una bola de nieve. Ahorrar el{" "}
              <strong>10% de tus ingresos</strong> hoy puede valer el triple en el
              futuro. ¡No subestimes los pequeños gastos hormiga!"
            </p>
            <button
              className="self-start text-[11px] font-bold px-3 py-1 rounded-full transition-colors"
              style={{ background: "#84D175", color: "white" }}
            >
              Más consejos →
            </button>
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "#84D175", opacity: .10 }}
            />
          </div>

          {/* Cuestionarios */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(145deg, #BDE2F2 0%, #668EA5 100%)",
              border: "1px solid rgba(102,142,165,0.25)",
            }}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} style={{ color: "#12263A" }} />
              <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#12263A" }}>
                Cuestionarios
              </div>
              <span
                className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(18,38,58,0.12)", color: "#12263A" }}
              >
                2/4
              </span>
            </div>
            <ul className="space-y-2 flex-1">
              {quizzes.map(({ done, label }) => (
                <li key={label} className="flex items-center gap-2">
                  {done
                    ? <CheckCircle size={14} style={{ color: "#12263A", flexShrink: 0 }} />
                    : <Circle size={14} style={{ color: "rgba(255,255,255,0.60)", flexShrink: 0 }} />
                  }
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      color: done ? "#12263A" : "rgba(255,255,255,0.85)",
                      fontWeight: done ? 600 : 400,
                      textDecoration: done ? "line-through" : "none",
                      opacity: done ? 1 : .85,
                    }}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="self-start text-[11px] font-bold px-3 py-1 rounded-full transition-colors mt-1"
              style={{ background: "#12263A", color: "#FFFACB" }}
            >
              Continuar →
            </button>
          </div>
        </div>

        {/* ── ETIQUETA SALUD FINANCIERA ── */}
        <div className="flex items-center gap-3">
          <div
            className="px-5 py-2 rounded-full text-[13px] font-bold"
            style={{ background: "#FABE0B", color: "#12263A" }}
          >
            💪 Salud financiera: <span style={{ color: "#AE6D21" }}>Buena</span>
          </div>
          <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }} />
          <div className="text-[11px]" style={{ color: "#668EA5" }}>
            Actualizado hoy
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{
          background: "#BDE2F2",
          borderTop: "1px solid rgba(18,38,58,0.08)",
        }}
      >
        <button
          className="flex items-center gap-2 text-[12px] font-bold transition-colors"
          style={{ color: "#668EA5" }}
          onMouseOver={e => (e.currentTarget as HTMLElement).style.color = "#405FFA"}
          onMouseOut={e => (e.currentTarget as HTMLElement).style.color = "#668EA5"}
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
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ border: "2px solid rgba(18,38,58,0.18)", color: "#668EA5" }}
          title="Ayuda y Soporte"
          onMouseOver={e => {
            (e.currentTarget as HTMLElement).style.background = "#12263A";
            (e.currentTarget as HTMLElement).style.color = "white";
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#668EA5";
          }}
        >
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}