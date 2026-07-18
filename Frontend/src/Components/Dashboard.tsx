import { useEffect, useMemo, useRef, useState } from "react";
import type { ElementType, FormEvent } from "react";
import {
  Mail, HelpCircle, TrendingUp, TrendingDown, ArrowUpRight, BookOpen,
  CheckCircle, Circle, Wallet, Loader2, Target, Sparkles, ChevronRight,
  GraduationCap, Briefcase, Gift, Tag, Utensils, Bus, School, Ticket, Shirt,
  Pencil, X, Info,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { BetoCoinHero, BetoDashboard, FloatingCoins, CoinNode, Sparkline, PatternDots } from "./Ilustraciones.tsx";
import { obtenerMovimientos } from "../services/api";
import type { Movimiento } from "../models/Movimiento";
import { C } from "./theme.ts";

type DashboardProps = {
  onNavigate?: (vista: string) => void;
};

const quizzes = [
  { done: true, label: "1. Salud Financiera Básica" },
  { done: true, label: "2. ¿Qué tanto sabes del Ahorro?" },
  { done: false, label: "3. Cuestionario Semanal: Presupuestos" },
  { done: false, label: "4. Mitos del Crédito Joven" },
];

const consejosDelDia = [
  <>El interés compuesto es como una bola de nieve. Ahorrar el <strong>10% de tus ingresos</strong> hoy puede valer el triple en el futuro. ¡No subestimes los pequeños gastos hormiga!</>,
  <>Antes de comprar algo que no estaba en tus planes, espera 24 horas. Si al día siguiente lo sigues queriendo, probablemente sí lo necesitas.</>,
  <>Divide cada ingreso en tres partes: <strong>gastos</strong>, <strong>ahorro</strong> y <strong>diversión</strong>. Así el dinero nunca se te escapa de las manos.</>,
  <>Anota hasta los gastos chiquitos. Los «gastos hormiga» —un café aquí, una propina allá— son los que más balance se comen al mes.</>,
];

const categoriaIconos: Record<string, ElementType> = {
  Becas: GraduationCap, Mesada: Wallet, Trabajo: Briefcase, Regalos: Gift, Ventas: Tag,
  Comida: Utensils, Transporte: Bus, Escuela: School, Salidas: Ticket, Ropa: Shirt,
};

// ── Persistencia local de la meta de ahorro ──────────────────────
// No existe tabla en la BD para esto (ver modelos Usuario/Movimiento),
// por lo que se guarda en localStorage, igual que ya hace este proyecto
// con "beta_articulos_guardados" y "beta_cuestionarios_progreso".
const META_AHORRO_KEY = "beta_meta_ahorro";
const PORCENTAJE_AHORRO_KEY = "beta_porcentaje_ahorro";
const META_AHORRO_DEFAULT = 1000;
const PORCENTAJE_DEFAULT = 20; // %
const PORCENTAJES_SUGERIDOS = [10, 20, 30, 50];
// ───────────────────────────────────────────────────────────────

function useCountUp(valor: number, duracion = 900) {
  const [display, setDisplay] = useState(valor);
  const anterior = useRef(valor);

  useEffect(() => {
    const inicio = anterior.current;
    const delta = valor - inicio;
    if (delta === 0) return;

    const t0 = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duracion);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(inicio + delta * ease);
      if (p < 1) frame = requestAnimationFrame(tick);
      else anterior.current = valor;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [valor, duracion]);

  return display;
}

function formatMonto(n: number) {
  return `$${n.toFixed(2)}`;
}

function tiempoRelativo(fecha: string): string {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  const semanas = Math.floor(dias / 7);
  return `Hace ${semanas} sem`;
}

function cargarMetaGuardada(): number {
  try {
    const guardada = localStorage.getItem(META_AHORRO_KEY);
    const valor = guardada ? Number(guardada) : META_AHORRO_DEFAULT;
    return Number.isFinite(valor) && valor > 0 ? valor : META_AHORRO_DEFAULT;
  } catch {
    return META_AHORRO_DEFAULT;
  }
}

function cargarPorcentajeGuardado(): number {
  try {
    const guardado = localStorage.getItem(PORCENTAJE_AHORRO_KEY);
    const valor = guardado ? Number(guardado) : PORCENTAJE_DEFAULT;
    return Number.isFinite(valor) && valor > 0 && valor <= 100 ? valor : PORCENTAJE_DEFAULT;
  } catch {
    return PORCENTAJE_DEFAULT;
  }
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [consejoIdx, setConsejoIdx] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  // ── Meta de ahorro y porcentaje del saldo usado ─────────────
  const [metaAhorro, setMetaAhorro] = useState<number>(cargarMetaGuardada);
  const [porcentajeAhorro, setPorcentajeAhorro] = useState<number>(cargarPorcentajeGuardado);

  const [modalMetaAbierto, setModalMetaAbierto] = useState(false);
  const [metaInput, setMetaInput] = useState<string>(String(cargarMetaGuardada()));
  const [porcentajeInput, setPorcentajeInput] = useState<number>(cargarPorcentajeGuardado());
  const [metaErrorForm, setMetaErrorForm] = useState<string | null>(null);
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(false);

    obtenerMovimientos()
      .then((movs) => {
        if (activo) setMovimientos(movs);
      })
      .catch(() => {
        if (activo) setError(true);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const { totalIngresos, totalEgresos, balance } = useMemo(() => {
    const ingresos = movimientos.filter((m) => m.tipo === "ingreso").reduce((acc, m) => acc + Number(m.monto), 0);
    const egresos = movimientos.filter((m) => m.tipo === "egreso").reduce((acc, m) => acc + Number(m.monto), 0);
    return { totalIngresos: ingresos, totalEgresos: egresos, balance: ingresos - egresos };
  }, [movimientos]);

  const ingresosAnim = useCountUp(totalIngresos);
  const egresosAnim = useCountUp(totalEgresos);
  const balanceAnim = useCountUp(balance);
  const balancePositivo = balance >= 0;

  // ── Cálculo de la meta de ahorro ─────────────────────────────
  // Se toma el X% (configurable) del saldo actual (sin negativos)
  // como el "saldo destinado" a la meta de ahorro.
  const saldoParaMeta = useMemo(
    () => Math.max(0, balance) * (porcentajeAhorro / 100),
    [balance, porcentajeAhorro]
  );
  const saldoMetaAnim = useCountUp(saldoParaMeta);

  const savingPct = metaAhorro > 0
    ? Math.min(100, Math.round((saldoParaMeta / metaAhorro) * 100))
    : 0;
  const faltanteMeta = Math.max(0, metaAhorro - saldoParaMeta);
  const metaCompletada = metaAhorro > 0 && saldoParaMeta >= metaAhorro;
  // ─────────────────────────────────────────────────────────────

  const recientes = useMemo(
    () =>
      [...movimientos]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 6),
    [movimientos]
  );

  function abrirModalMeta() {
    setMetaInput(String(metaAhorro));
    setPorcentajeInput(porcentajeAhorro);
    setMetaErrorForm(null);
    setModalMetaAbierto(true);
  }

  function cerrarModalMeta() {
    setModalMetaAbierto(false);
    setMetaErrorForm(null);
  }

  function guardarMeta(e: FormEvent) {
    e.preventDefault();
    const valorMeta = Number(metaInput);
    const valorPorcentaje = Number(porcentajeInput);

    if (!metaInput.trim() || !Number.isFinite(valorMeta) || valorMeta <= 0) {
      setMetaErrorForm("Ingresa un monto de meta válido mayor a $0.");
      return;
    }
    if (!Number.isFinite(valorPorcentaje) || valorPorcentaje <= 0 || valorPorcentaje > 100) {
      setMetaErrorForm("El porcentaje debe estar entre 1% y 100%.");
      return;
    }

    setMetaAhorro(valorMeta);
    setPorcentajeAhorro(valorPorcentaje);

    try {
      localStorage.setItem(META_AHORRO_KEY, String(valorMeta));
      localStorage.setItem(PORCENTAJE_AHORRO_KEY, String(valorPorcentaje));
    } catch {
      /* noop */
    }

    setModalMetaAbierto(false);
    setMetaErrorForm(null);
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col relative" style={{ background: `radial-gradient(ellipse 80% 60% at 12% 0%, ${C.blueSoft} 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 100% 15%, ${C.turquoiseSoft} 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 95%, ${C.sunSoft} 0%, transparent 50%), ${C.cream}`, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.94) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes coinFloat { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
        @keyframes wave { 0%,100% { transform: rotate(20deg); } 50% { transform: rotate(50deg); } }
        @keyframes coinDrift { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-14px) translateX(6px); } }
        @keyframes slideInLeft { from { opacity:0; transform: translateX(-14px); } to { opacity:1; transform: translateX(0); } }
        @keyframes ringGlow { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes popInModal { from { opacity:0; transform: scale(.9) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
        .beta-grid { display:flex; flex-direction:column; gap:20px; }
        @media (min-width:1024px) {
          .beta-grid {
            display:grid;
            grid-template-columns: repeat(12, minmax(0,1fr));
            grid-template-rows: auto auto auto auto;
            grid-template-areas:
              "hero hero hero hero hero hero hero tip tip tip tip tip"
              "hero hero hero hero hero hero hero tip tip tip tip tip"
              "stat1 stat1 stat1 stat1 stat1 stat2 stat2 stat2 stat3 stat3 stat3 stat3"
              "moves moves moves moves moves moves moves quiz quiz quiz quiz quiz";
            gap:22px;
          }
          .area-hero{grid-area:hero;} .area-tip{grid-area:tip;}
          .area-stat1{grid-area:stat1;} .area-stat2{grid-area:stat2;} .area-stat3{grid-area:stat3;}
          .area-moves{grid-area:moves;} .area-quiz{grid-area:quiz;}
        }
        .beta-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: rgba(18,38,58,0.1);
          outline: none;
        }
        .beta-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${C.blue};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(15,33,56,0.35);
          cursor: pointer;
        }
        .beta-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${C.blue};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(15,33,56,0.35);
          cursor: pointer;
        }
      `}</style>

      <FloatingCoins />

      <header className="sticky top-4 z-30 mx-4 md:mx-8 mt-4 flex items-center justify-between px-5 py-3 rounded-full" style={{ background: "rgba(255,255,255,0.66)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1.5px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px -12px rgba(18,38,58,0.28)" }}>
        <div className="flex items-center gap-3">
          <div style={{ animation: "coinFloat 3s ease-in-out infinite" }}><BetoDashboard /></div>
          <div>
            <div className="font-['Space_Grotesk'] font-extrabold text-[14px] md:text-[15px]" style={{ color: C.navy }}>
              ¡Bienvenido de nuevo, <span style={{ color: C.mandarin }}>usuario_67</span>!
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ background: "rgba(250,190,11,0.18)" }} title="Notificaciones">
            <span className="text-[16px]">🔔</span>
          </button>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white text-sm" style={{ background: C.blue, boxShadow: `0 3px 0 ${C.blueDeep}` }}>U</div>
        </div>
      </header>

      <div className="beta-grid flex-1 px-4 md:px-8 py-7 max-w-7xl w-full mx-auto relative z-10">

        {/* HERO — meta de ahorro (editable, clic para abrir modal) */}
        <div
          className="area-hero relative rounded-[36px] p-7 flex flex-col justify-center gap-5 border border-white/60 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${C.blue}E6 0%, ${C.turquoise}CC 100%)`, backdropFilter: "blur(6px)", boxShadow: `0 1px 2px rgba(18,38,58,0.1), 0 18px 32px -14px rgba(64,95,250,0.55), 0 32px 60px -24px rgba(15,33,56,0.4)`, animation: "popIn .45s ease-out both" }}
          onClick={abrirModalMeta}
          title="Toca para editar tu meta de ahorro"
        >
          <div className="absolute inset-0 rounded-[36px] overflow-hidden pointer-events-none">
            <PatternDots color="#FFFFFF" opacity={0.12} size={16} />
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full" style={{ background: "white", opacity: 0.08 }} />
            <div className="absolute -left-10 -bottom-16 w-44 h-44 rounded-full" style={{ background: C.navy, opacity: 0.1 }} />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); abrirModalMeta(); }}
            className="absolute z-30 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['Space_Grotesk'] font-extrabold text-[11px] uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
            style={{ top: -18, right: 28, transform: "rotate(-7deg)", background: C.sun, color: C.navy, border: `2.5px solid ${C.navy}`, boxShadow: "0 4px 0 rgba(15,33,56,0.3)" }}
          >
            <Sparkles size={12} /> {savingPct}% logrado
          </button>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest z-10" style={{ color: "rgba(255,255,255,0.9)" }}>
            <Target size={13} /> Meta de ahorro
            <Pencil size={12} style={{ opacity: 0.75 }} />
          </div>

          <div className="flex items-center gap-6 z-10">
            <div className="relative flex-shrink-0">
              <svg width={148} height={148} className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
                <circle cx={74} cy={74} r={66} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={10} />
                <circle
                  cx={74} cy={74} r={66} fill="none" stroke={C.sun} strokeWidth={10} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 66}
                  strokeDashoffset={2 * Math.PI * 66 * (1 - savingPct / 100)}
                  style={{ transition: "stroke-dashoffset 1.1s ease-out", animation: "ringGlow 2.4s ease-in-out infinite" }}
                />
              </svg>
              <div className="w-[148px] h-[148px] flex items-end justify-center pb-1">
                <BetoCoinHero size={104} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[34px] font-extrabold leading-none" style={{ color: "white" }}>
                {cargando ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>${saldoMetaAnim.toFixed(0)}<span className="text-[18px] font-bold opacity-70"> / ${metaAhorro.toFixed(0)}</span></>
                )}
              </div>
              <div className="text-[12px] mt-2 font-semibold" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Inter',sans-serif" }}>
                {error ? (
                  "No se pudo calcular tu avance. Verifica tu conexión."
                ) : metaCompletada ? (
                  <>¡Meta cumplida! 🎉 Toca para definir una nueva meta</>
                ) : (
                  <>¡Vas bien! Faltan <strong style={{ color: C.sun }}>${faltanteMeta.toFixed(2)}</strong> para tu meta 🎯</>
                )}
              </div>
              <div className="w-full rounded-full h-3 overflow-hidden mt-3" style={{ background: "rgba(255,255,255,0.25)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${savingPct}%`, background: `linear-gradient(90deg, ${C.sun}, #FFE985)` }} />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[10.5px] font-medium" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Inter',sans-serif" }}>
                <Info size={11} /> Usamos el {porcentajeAhorro}% de tu saldo actual como avance hacia esta meta
              </div>
            </div>
          </div>
        </div>

        {/* CONSEJO DEL DIA */}
        <div className="area-tip relative rounded-[28px] p-5 flex flex-col gap-2.5 border-[3px] overflow-hidden" style={{ background: "rgba(221,246,247,0.75)", backdropFilter: "blur(10px)", borderColor: C.turquoise, animation: "popIn .45s ease-out .14s both" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px]" style={{ background: "white" }}>💡</div>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#0E7490" }}>Consejo del día</div>
          </div>
          <p className="text-[12.5px] leading-relaxed" style={{ fontFamily: "'Inter',sans-serif", color: C.navy }}>
            {consejosDelDia[consejoIdx]}
          </p>
          <button onClick={() => setConsejoIdx((i) => (i + 1) % consejosDelDia.length)} className="self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-transform hover:scale-105" style={{ background: C.turquoise, color: "white" }}>Más consejos →</button>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none" style={{ background: C.turquoise, opacity: 0.14 }} />
        </div>

        {/* STAT: INGRESOS */}
        <div className="area-stat1 group relative rounded-[30px] p-5 flex flex-col gap-2 cursor-pointer border-[3px] overflow-hidden" style={{ background: C.mossSoft, borderColor: C.moss, boxShadow: `0 6px 0 ${C.moss}55, 0 16px 26px -10px rgba(15,33,56,0.2)`, animation: "popIn .45s ease-out .2s both" }} onClick={() => onNavigate && onNavigate("ingresos")}>
          <PatternDots color="#3D7A41" opacity={0.06} size={13} />
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110" style={{ background: "white", borderColor: C.moss }}>
              <TrendingUp size={17} color="#3D7A41" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(132,209,117,0.35)", color: "#3D7A41" }}>+12%</span>
          </div>
          <div className="text-[20px] font-extrabold z-10 tabular-nums" style={{ color: C.navy, fontFamily: "'JetBrains Mono','Space Mono',ui-monospace,monospace" }}>
            {cargando ? <Loader2 size={18} className="animate-spin" /> : formatMonto(ingresosAnim)}
          </div>
          <div className="text-[11px] font-bold z-10" style={{ color: "#3D7A41" }}>Ingresos del mes</div>
        </div>

        {/* STAT: BALANCE (destacado, centro, más oscuro) */}
        <div className="area-stat2 group relative rounded-[30px] p-5 flex flex-col gap-2 justify-center border-[3px] overflow-hidden" style={{ background: errorCardBg(error), borderColor: error ? "#F87171" : C.navy, boxShadow: `0 6px 0 rgba(15,33,56,0.4), 0 16px 26px -10px rgba(15,33,56,0.3)`, animation: "popIn .45s ease-out .26s both", transform: "translateY(-6px)" }}>
          <PatternDots color="#FFFFFF" opacity={0.05} size={13} />
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2" style={{ background: "rgba(255,255,255,0.1)", borderColor: error ? "#F87171" : C.blue }}>
              <Wallet size={17} color={error ? "#F87171" : C.blue} />
            </div>
          </div>
          <div className="text-[22px] font-extrabold z-10 tabular-nums" style={{ color: "white", fontFamily: "'JetBrains Mono','Space Mono',ui-monospace,monospace" }}>
            {cargando ? <Loader2 size={18} className="animate-spin" color="white" /> : error ? "—" : formatMonto(balanceAnim)}
          </div>
          <div className="text-[11px] font-bold z-10" style={{ color: error ? "#F87171" : "rgba(255,255,255,0.7)" }}>{error ? "No se pudo cargar" : `Saldo actual · ${balancePositivo ? "positivo" : "negativo"}`}</div>
          {!cargando && !error && (
            <div className="mt-1 z-10 opacity-80">
              <Sparkline data={[4, 3.5, 5, 4, 6, 5.5, balancePositivo ? 7 : 2]} color={C.turquoise} />
            </div>
          )}
        </div>

        {/* STAT: EGRESOS */}
        <div className="area-stat3 group relative rounded-[30px] p-5 flex flex-col gap-2 cursor-pointer border-[3px] overflow-hidden" style={{ background: C.mandarinSoft, borderColor: C.mandarin, boxShadow: `0 6px 0 ${C.mandarin}55, 0 16px 26px -10px rgba(15,33,56,0.2)`, animation: "popIn .45s ease-out .32s both" }} onClick={() => onNavigate && onNavigate("egresos")}>
          <PatternDots color="#AE6D21" opacity={0.06} size={13} />
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110" style={{ background: "white", borderColor: C.mandarin }}>
              <TrendingDown size={17} color="#AE6D21" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(248,145,12,0.22)", color: "#AE6D21" }}>-8%</span>
          </div>
          <div className="text-[20px] font-extrabold z-10 tabular-nums" style={{ color: C.navy, fontFamily: "'JetBrains Mono','Space Mono',ui-monospace,monospace" }}>
            {cargando ? <Loader2 size={18} className="animate-spin" /> : formatMonto(egresosAnim)}
          </div>
          <div className="text-[11px] font-bold z-10" style={{ color: "#AE6D21" }}>Egresos del mes</div>
        </div>

        {/* MOVIMIENTOS — timeline */}
        <div className="area-moves relative rounded-[32px] p-6 border-[3px]" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderColor: "rgba(18,38,58,0.1)", boxShadow: `0 6px 0 rgba(15,33,56,0.06), 0 16px 26px -10px rgba(15,33,56,0.14)`, animation: "popIn .45s ease-out .38s both" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={17} color={C.navy} />
              <h3 className="font-extrabold text-[14px]" style={{ color: C.navy }}>Movimientos recientes</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: C.blueSoft, color: C.blue }}>{movimientos.length}</span>
            </div>
            <button onClick={() => onNavigate && onNavigate("balance")} className="flex items-center gap-0.5 text-[11px] font-bold transition-transform hover:translate-x-0.5" style={{ color: C.blue }}>
              Ver todos <ChevronRight size={13} />
            </button>
          </div>
          {cargando ? (
            <div className="flex items-center gap-2 text-[13px] py-6 justify-center" style={{ color: C.slate }}>
              <Loader2 size={16} className="animate-spin" /> Cargando movimientos...
            </div>
          ) : recientes.length === 0 ? (
            <div className="text-[12px] py-6 text-center" style={{ color: C.slate }}>Aún no tienes movimientos registrados.</div>
          ) : (
            <div className="relative flex flex-col gap-3">
              <div className="absolute left-5 top-2 bottom-2 w-[2px]" style={{ background: "rgba(18,38,58,0.08)" }} />
              {recientes.map((m, i) => {
                const esIngreso = m.tipo === "ingreso";
                const Icono = categoriaIconos[m.categoria] ?? Tag;
                const color = esIngreso ? "#3D7A41" : "#AE6D21";
                const bg = esIngreso ? C.mossSoft : C.mandarinSoft;
                return (
                  <div key={m.id ?? i} className="flex items-center gap-3 relative" style={{ animation: `slideInLeft .35s ease-out ${i * 0.05}s both` }}>
                    <CoinNode Icon={Icono} color={color} bg={bg} />
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5" style={{ background: "rgba(255,255,255,0.7)" }}>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-bold truncate" style={{ color: C.navy }}>{m.descripcion}</div>
                        <div className="text-[10.5px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>{m.categoria} · {tiempoRelativo(m.fecha)}</div>
                      </div>
                      <div className="text-[13px] font-extrabold flex-shrink-0 tabular-nums" style={{ color, fontFamily: "'JetBrains Mono','Space Mono',ui-monospace,monospace" }}>
                        {esIngreso ? "+" : "-"}{formatMonto(Number(m.monto))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CUESTIONARIOS */}
        <div className="area-quiz relative rounded-[32px] p-6 flex flex-col gap-3 border-[3px] overflow-hidden" style={{ background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 100%)`, borderColor: C.navy, boxShadow: `0 6px 0 rgba(15,33,56,0.5), 0 16px 26px -10px rgba(15,33,56,0.4)`, animation: "popIn .45s ease-out .44s both" }}>
          <PatternDots color="#FFFFFF" opacity={0.05} size={20} />
          <div className="flex items-center gap-2 z-10">
            <BookOpen size={17} color={C.sun} />
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.sun }}>Cuestionarios</div>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>2/4</span>
          </div>
          <ul className="space-y-2 flex-1 z-10">
            {quizzes.map(({ done, label }) => (
              <li key={label} className="flex items-center gap-2">
                {done ? <CheckCircle size={14} color={C.sun} /> : <Circle size={14} color="rgba(255,255,255,0.3)" />}
                <span className="text-[12px]" style={{ fontFamily: "'Inter',sans-serif", color: done ? "white" : "rgba(255,255,255,0.6)", fontWeight: done ? 600 : 400, textDecoration: done ? "line-through" : "none" }}>{label}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate && onNavigate("cuestionarios")} className="self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-transform hover:scale-105 flex items-center gap-1 z-10" style={{ background: C.sun, color: C.navy }}>
            <Sparkles size={12} /> Continuar
          </button>
        </div>
      </div>

      {/* MODAL — editar meta de ahorro y porcentaje del saldo usado */}
      {modalMetaAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(18,38,58,0.5)" }}
          onClick={cerrarModalMeta}
        >
          <form
            onSubmit={guardarMeta}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[28px] p-6 max-w-sm w-full border-[3px]"
            style={{ borderColor: C.navy, boxShadow: "0 20px 50px rgba(15,33,56,0.3)", animation: "popInModal .25s cubic-bezier(.34,1.56,.64,1)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] font-extrabold text-[16px]" style={{ color: C.navy }}>
                Editar meta de ahorro
              </h3>
              <button
                type="button"
                onClick={cerrarModalMeta}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X size={15} color={C.slate} />
              </button>
            </div>

            {metaErrorForm && (
              <div className="mb-3 px-3 py-2 rounded-xl text-[12px] font-semibold" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                ⚠️ {metaErrorForm}
              </div>
            )}

            {/* Monto de la meta */}
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>
              Monto de la meta
            </label>
            <input
              type="number"
              min={1}
              step="0.01"
              autoFocus
              value={metaInput}
              onChange={(e) => setMetaInput(e.target.value)}
              placeholder="Ej. 1000"
              className="w-full py-2.5 px-3 text-[14px] rounded-xl outline-none border-2 mb-4 transition-colors duration-150"
              style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
              onFocus={(e) => (e.target.style.borderColor = C.blue)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(18,38,58,0.12)")}
            />

            {/* Porcentaje del saldo a usar */}
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.slate }}>
                % de tu saldo a destinar
              </label>
              <span className="text-[13px] font-extrabold" style={{ color: C.blue }}>{porcentajeInput}%</span>
            </div>

            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={porcentajeInput}
              onChange={(e) => setPorcentajeInput(Number(e.target.value))}
              className="beta-slider w-full mb-3"
            />

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {PORCENTAJES_SUGERIDOS.map((p) => {
                const activo = porcentajeInput === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPorcentajeInput(p)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all duration-150"
                    style={{
                      background: activo ? C.blue : "white",
                      color: activo ? "white" : C.blue,
                      borderColor: C.blue,
                    }}
                  >
                    {p}%
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] mb-5 flex items-start gap-1.5" style={{ color: C.slate }}>
              <Info size={13} className="flex-shrink-0 mt-0.5" />
              Con {porcentajeInput}% de tu saldo actual (${Math.max(0, balance).toFixed(2)}), tendrías ${(Math.max(0, balance) * (porcentajeInput / 100)).toFixed(2)} de avance hacia tu meta.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cerrarModalMeta}
                className="px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-95 active:scale-95"
                style={{ background: "#F4EDEA", color: C.navy }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-full text-[12px] font-bold text-white transition-all duration-150 hover:brightness-105 active:scale-95"
                style={{ background: C.blue }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <footer className="flex items-center justify-between px-8 py-4 flex-shrink-0 relative z-10">
        <a href="mailto:beta@example.com" className="flex items-center gap-2 text-[12px] font-bold transition-colors hover:opacity-70" style={{ color: C.slate }}>
          <Mail size={14} /> beta@example.com
        </a>
        <div className="flex flex-col items-center">
          <BetaLogo size={22} />
          <span className="text-[10px] font-bold mt-0.5" style={{ color: C.blue }}>BETA: Finanzas para los Jóvenes</span>
        </div>
        <button onClick={() => onNavigate && onNavigate("contacto")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: `2px solid ${C.navy}20`, color: C.slate, background: "rgba(255,255,255,0.5)" }} title="Ayuda y Soporte">
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}

function errorCardBg(error: boolean) {
  return error ? "#7A2E2E" : "#12263A";
}