import { useState, useEffect } from "react";
import {
  Mail, HelpCircle, TrendingUp, TrendingDown, ArrowUpRight, BookOpen,
  CheckCircle, Circle, Wallet, Loader2, Flame, Target, Sparkles,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { BetoDashboard, Sparkline, PatternDots } from "./Ilustraciones.tsx";
import { obtenerMovimientos } from "../services/api";
import { C } from "./theme.ts";

type DashboardProps = {
  onNavigate?: (vista: string) => void;
};

const movCards = [
  { label: "Ingresos del mes", amount: "$3,200.00", change: "+12%", up: true, bg: "#E4F7E1", border: C.moss, color: "#3D7A41", Icon: TrendingUp, spark: [3, 4, 3.5, 5, 4.5, 6, 7] },
  { label: "Egresos del mes", amount: "$2,733.00", change: "-8%", up: false, bg: "#FDECDD", border: C.mandarin, color: "#AE6D21", Icon: TrendingDown, spark: [6, 5.5, 6.5, 5, 4.5, 4, 3.5] },
  { label: "Últimos movimientos", amount: "14", change: "transacciones", up: true, bg: "#DCEBFB", border: C.blue, color: C.navy, Icon: ArrowUpRight, spark: [2, 4, 3, 5, 4, 6, 5] },
];

const quizzes = [
  { done: true, label: "1. Salud Financiera Básica" },
  { done: true, label: "2. ¿Qué tanto sabes del Ahorro?" },
  { done: false, label: "3. Cuestionario Semanal: Presupuestos" },
  { done: false, label: "4. Mitos del Crédito Joven" },
];

const consejosDelDia = [
  <>"El interés compuesto es como una bola de nieve. Ahorrar el <strong>10% de tus ingresos</strong> hoy puede valer el triple en el futuro. ¡No subestimes los pequeños gastos hormiga!"</>,
  <>"Antes de comprar algo que no estaba en tus planes, espera 24 horas. Si al día siguiente lo sigues queriendo, probablemente sí lo necesitas."</>,
  <>"Divide cada ingreso en tres partes: <strong>gastos</strong>, <strong>ahorro</strong> y <strong>diversión</strong>. Así el dinero nunca se te escapa de las manos."</>,
  <>"Anota hasta los gastos chiquitos. Los «gastos hormiga» —un café aquí, una propina allá— son los que más balance se comen al mes."</>,
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const savingPct = 46;

  const [consejoIdx, setConsejoIdx] = useState(0);
  const [cargandoBalance, setCargandoBalance] = useState(true);
  const [balanceTotal, setBalanceTotal] = useState<number | null>(null);
  const [errorBalance, setErrorBalance] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargandoBalance(true);
    setErrorBalance(false);

    obtenerMovimientos()
      .then((movs) => {
        if (!activo) return;
        const totalIngresos = movs
          .filter((m) => m.tipo === "ingreso")
          .reduce((acc, m) => acc + Number(m.monto), 0);
        const totalEgresos = movs
          .filter((m) => m.tipo === "egreso")
          .reduce((acc, m) => acc + Number(m.monto), 0);
        setBalanceTotal(totalIngresos - totalEgresos);
      })
      .catch(() => {
        if (activo) setErrorBalance(true);
      })
      .finally(() => {
        if (activo) setCargandoBalance(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const balancePositivo = (balanceTotal ?? 0) >= 0;

  return (
    <div className="flex-1 min-h-screen flex flex-col" style={{ background: C.cream, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.92) translateY(6px); } to { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes coinFloat { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
      `}</style>

      <header className="flex items-center justify-between px-8 py-4 flex-shrink-0" style={{ background: "white", borderBottom: "2px solid rgba(18,38,58,0.06)" }}>
        <div className="flex items-center gap-3">
          <div style={{ animation: "coinFloat 3s ease-in-out infinite" }}><BetoDashboard /></div>
          <div>
            <div className="font-['Space_Grotesk'] font-extrabold text-[15px]" style={{ color: C.navy }}>
              ¡Bienvenido de nuevo, <span style={{ color: C.mandarin }}>usuario_67</span>!
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: C.moss }}><Flame size={12} /> 5 días de racha</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ background: "rgba(250,190,11,0.14)" }} title="Notificaciones">
            <span className="text-[16px]">🔔</span>
          </button>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white text-sm" style={{ background: C.blue }}>U</div>
        </div>
      </header>

      <div className="flex-1 px-8 py-7 grid grid-cols-12 gap-5 auto-rows-min max-w-7xl w-full mx-auto">
        <div className="col-span-12 lg:col-span-8 rounded-[28px] p-6 flex items-center gap-6 relative overflow-hidden border-[3px] transition-transform duration-200 hover:-translate-y-1" style={{ background: "#DCEBFB", borderColor: C.blue, animation: "popIn .4s ease-out both" }}>
          <div className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl z-10 border-2" style={{ background: C.blue, borderColor: C.navy }}>U</div>
          <div className="flex-1 z-10">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: C.slate }}><Target size={12} /> Meta de ahorro</div>
                <div className="text-[20px] font-extrabold" style={{ color: C.navy }}>$467.00 <span className="text-[13px] font-normal" style={{ color: C.slate }}>/ $1,000.00</span></div>
              </div>
              <div className="text-[24px] font-extrabold" style={{ color: C.blue }}>{savingPct}%</div>
            </div>
            <div className="w-full rounded-full h-3.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.7)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${savingPct}%`, background: `linear-gradient(90deg, ${C.blue}, ${C.turquoise})` }} />
            </div>
            <div className="text-[11px] mt-1.5" style={{ color: C.slate }}>¡Vas muy bien! Faltan <strong style={{ color: C.navy }}>$533.00</strong> para tu meta 🎯</div>
          </div>
          <div className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full pointer-events-none" style={{ background: C.blue, opacity: 0.08 }} />
        </div>

        <div className="col-span-12 lg:col-span-4 rounded-[42px] p-6 flex flex-col justify-center items-center gap-2.5 relative overflow-hidden border-[3px] transition-transform duration-200 hover:-translate-y-1" style={{ background: C.sun, borderColor: C.navy, boxShadow: `0 8px 0 rgba(15,33,56,0.35), 0 20px 32px -12px rgba(15,33,56,0.35)`, animation: "popIn .4s ease-out .05s both" }}>
          <PatternDots color="#FFFFFF" opacity={0.35} size={15} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.30) 0%, transparent 45%)" }} />
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none" style={{ background: "white", opacity: 0.14 }} />
          <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full pointer-events-none" style={{ background: C.navy, opacity: 0.06 }} />
          <div style={{ animation: "coinFloat 2.6s ease-in-out infinite" }}><Flame size={30} color={C.navy} /></div>
          <div className="font-['Space_Grotesk'] font-extrabold text-[26px] z-10" style={{ color: C.navy }}>5 días</div>
          <div className="text-[11px] font-bold uppercase tracking-widest z-10" style={{ color: "#8A5B00" }}>Racha activa 🔥</div>
          <div className="flex items-center gap-1.5 z-10 mt-1">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2" title={d} style={{ background: i < 5 ? C.navy : "rgba(255,255,255,0.5)", color: i < 5 ? C.sun : "#8A5B00", borderColor: C.navy, boxShadow: i < 5 ? "0 2px 0 rgba(0,0,0,0.25)" : "none" }}>
                {i < 5 ? <Flame size={10} /> : d}
              </div>
            ))}
          </div>
        </div>

        {movCards.map(({ label, amount, change, up, bg, border, color, Icon, spark }, i) => (
          <div key={label} className="group col-span-6 lg:col-span-3 rounded-[36px] p-4 flex flex-col gap-2 cursor-pointer border-[3px] relative overflow-hidden transition-transform duration-200 hover:-translate-y-1.5" style={{ background: bg, borderColor: border, boxShadow: `0 6px 0 ${border}40, 0 16px 26px -10px rgba(15,33,56,0.22)`, animation: `popIn .4s ease-out ${0.1 + i * 0.05}s both` }}>
            <PatternDots color={color} opacity={0.07} size={13} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.35) 0%, transparent 40%)" }} />
            <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full pointer-events-none" style={{ background: color, opacity: 0.07 }} />
            <div className="flex items-center justify-between z-10">
              <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110" style={{ background: "white", borderColor: border, boxShadow: `0 2px 0 ${border}55` }}>
                <Icon size={18} color={color} />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: up ? "rgba(132,209,117,0.3)" : "rgba(248,145,12,0.22)", color: up ? "#3D7A41" : "#AE6D21" }}>{change}</span>
            </div>
            <div className="text-[19px] font-extrabold z-10" style={{ color: C.navy }}>{amount}</div>
            <div className="text-[11px] font-bold z-10" style={{ color }}>{label}</div>
            <div className="mt-1 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              <Sparkline data={spark} color={color} />
            </div>
          </div>
        ))}

        <div className="group col-span-6 lg:col-span-3 rounded-[36px] p-4 flex flex-col gap-2 cursor-pointer relative overflow-hidden border-[3px] transition-transform duration-200 hover:-translate-y-1.5" style={{ background: errorBalance ? "#FEE2E2" : "white", borderColor: errorBalance ? "#F87171" : C.navy, boxShadow: `0 6px 0 rgba(15,33,56,0.28), 0 16px 26px -10px rgba(15,33,56,0.22)`, animation: "popIn .4s ease-out .25s both" }}>
          <PatternDots color={C.blue} opacity={0.06} size={13} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.5) 0%, transparent 40%)" }} />
          <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full pointer-events-none" style={{ background: C.blue, opacity: 0.06 }} />
          <div className="flex items-center justify-between z-10">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110" style={{ background: errorBalance ? "#FEE2E2" : "#DCEBFB", borderColor: errorBalance ? "#F87171" : C.blue, boxShadow: `0 2px 0 ${errorBalance ? "#F8717155" : C.blue + "55"}` }}>
              <Wallet size={18} color={errorBalance ? "#B91C1C" : C.blue} />
            </div>
            {!cargandoBalance && !errorBalance && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: balancePositivo ? "rgba(132,209,117,0.3)" : "rgba(248,145,12,0.22)", color: balancePositivo ? "#3D7A41" : "#AE6D21" }}>{balancePositivo ? "positivo" : "negativo"}</span>
            )}
          </div>
          <div className="text-[19px] font-extrabold flex items-center gap-2 z-10" style={{ color: C.navy }}>
            {cargandoBalance ? <Loader2 size={18} className="animate-spin" color={C.blue} /> : errorBalance ? "—" : `$${(balanceTotal ?? 0).toFixed(2)}`}
          </div>
          <div className="text-[11px] font-bold z-10" style={{ color: errorBalance ? "#B91C1C" : C.blue }}>{errorBalance ? "No se pudo cargar el saldo" : "Saldo actual"}</div>
          {!cargandoBalance && !errorBalance && (
            <div className="mt-1 z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              <Sparkline data={[4, 3.5, 5, 4, 6, 5.5, balancePositivo ? 7 : 2]} color={C.blue} />
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-6 rounded-[28px] p-6 flex flex-col gap-3 relative overflow-hidden border-[3px] transition-transform duration-200 hover:-translate-y-1" style={{ background: "#DDF6F7", borderColor: C.turquoise, animation: "popIn .4s ease-out .3s both" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px]" style={{ background: "white" }}>💡</div>
            <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "#0E7490" }}>Consejo del día</div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'Inter',sans-serif", color: C.navy }}>
            {consejosDelDia[consejoIdx]}
          </p>
          <button onClick={() => setConsejoIdx((i) => (i + 1) % consejosDelDia.length)} className="self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-transform hover:scale-105" style={{ background: C.turquoise, color: "white" }}>Más consejos →</button>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full pointer-events-none" style={{ background: C.turquoise, opacity: 0.12 }} />
        </div>

        <div className="col-span-12 lg:col-span-6 rounded-[28px] p-6 flex flex-col gap-3 border-[3px] transition-transform duration-200 hover:-translate-y-1" style={{ background: C.navy, borderColor: C.navy, animation: "popIn .4s ease-out .35s both" }}>
          <div className="flex items-center gap-2">
            <BookOpen size={18} color={C.sun} />
            <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: C.sun }}>Cuestionarios</div>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "white" }}>2/4</span>
          </div>
          <ul className="space-y-2 flex-1">
            {quizzes.map(({ done, label }) => (
              <li key={label} className="flex items-center gap-2">
                {done ? <CheckCircle size={14} color={C.sun} /> : <Circle size={14} color="rgba(255,255,255,0.3)" />}
                <span className="text-[12px]" style={{ fontFamily: "'Inter',sans-serif", color: done ? "white" : "rgba(255,255,255,0.6)", fontWeight: done ? 600 : 400, textDecoration: done ? "line-through" : "none" }}>{label}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate && onNavigate("cuestionarios")} className="self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-transform hover:scale-105 flex items-center gap-1" style={{ background: C.sun, color: C.navy }}>
            <Sparkles size={12} /> Continuar
          </button>
        </div>
      </div>

      <footer className="flex items-center justify-between px-8 py-3 flex-shrink-0" style={{ background: "white", borderTop: "2px solid rgba(18,38,58,0.06)" }}>
        <a href="mailto:beta@example.com" className="flex items-center gap-2 text-[12px] font-bold transition-colors hover:opacity-70" style={{ color: C.slate }}>
          <Mail size={14} /> beta@example.com
        </a>
        <div className="flex flex-col items-center">
          <BetaLogo size={22} />
          <span className="text-[10px] font-bold mt-0.5" style={{ color: C.blue }}>BETA: Finanzas para los Jóvenes</span>
        </div>
        <button onClick={() => onNavigate && onNavigate("contacto")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: `2px solid ${C.navy}20`, color: C.slate }} title="Ayuda y Soporte">
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}
