import { useState } from "react";
import type { CSSProperties, ElementType } from "react";
import {
  Star, Sparkles, ArrowRight, Flame, PartyPopper, Mail, HelpCircle,
  Wallet, GraduationCap, LineChart,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { Beto, Ola, Sticker, RingProgress } from "./Ilustraciones";
import { C } from "./theme.ts";

type LandingPageProps = {
  onNavigate: (vista: string) => void;
};

type Oferta = {
  Icon: ElementType;
  bg: string;
  border: string;
  accent: string;
  title: string;
  desc: string;
  size: "lg" | "sm";
  progress: number;
  progressLabel: string;
  chips: string[];
  badge?: string;
};

const ofertas: Oferta[] = [
  { Icon: Wallet, bg: C.creamDeep, border: C.mandarin, accent: "#AE6D21", title: "Simulador financiero", desc: "Registra ingresos y egresos en tiempo real, ve tu balance moverse al instante y practica sin arriesgar un peso real.", size: "sm", progress: 68, progressLabel: "Balance simulado", chips: ["Ingresos", "Egresos", "Balance en vivo"] },
  { Icon: GraduationCap, bg: "#DCEBFB", border: C.blue, accent: "#2C46D6", title: "Módulo educativo", desc: "Lecciones cortas y cuestionarios sobre ahorro, crédito y presupuestos.", badge: "¡NUEVO!", size: "sm", progress: 30, progressLabel: "3/10 lecciones", chips: ["Ahorro", "Crédito", "Presupuestos"] },
  { Icon: LineChart, bg: "#E4F7E1", border: C.moss, accent: "#3D7A41", title: "Reportes mensuales", desc: "Analiza tus hábitos con reportes quincenales y mensuales, sin hojas de cálculo.", size: "sm", progress: 82, progressLabel: "Reportes al día", chips: ["Quincenal", "Mensual", "Tendencias"] },
];

const senderoPasos = [
  { label: "Regístrate", Icon: Sparkles, color: C.blue, bg: "#DCEBFB" },
  { label: "Simula", Icon: Wallet, color: C.mandarin, bg: C.creamDeep },
  { label: "Aprende", Icon: GraduationCap, color: C.mossDeep, bg: "#E4F7E1" },
  { label: "Analiza", Icon: LineChart, color: C.turquoise, bg: "#DDF6F7" },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.8) rotate(-4deg); } to { opacity:1; transform: scale(1) rotate(0); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes betoBob { 0%,100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-10px) rotate(1.5deg); } }
        @keyframes wave { 0%,100% { transform: rotate(20deg); } 50% { transform: rotate(50deg); } }
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(8deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
        @keyframes sparkleSpin { to { transform: rotate(360deg); } }
        .gummy { box-shadow: 0 6px 0 var(--g-shadow, #12263A); transition: transform .12s ease, box-shadow .12s ease; }
        .gummy:hover { transform: translateY(-3px); box-shadow: 0 9px 0 var(--g-shadow, #12263A); }
        .gummy:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g-shadow, #12263A); }
        .bento-card { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease; }
        .bento-card:hover { transform: translateY(-6px) rotate(-0.6deg); }
      `}</style>

      <section className="relative overflow-hidden px-10 lg:px-16 pt-14 pb-4" style={{ background: `linear-gradient(170deg, ${C.creamDeep} 0%, ${C.cream} 60%)` }}>
        <Star size={22} color={C.mandarin} className="absolute top-24 left-[38%] opacity-70" style={{ animation: "float1 5s ease-in-out infinite" }} />
        <Sparkles size={26} color={C.turquoise} className="absolute top-16 right-[8%] opacity-70" style={{ animation: "sparkleSpin 6s linear infinite" }} />
        <div className="absolute top-[30%] left-[6%] w-16 h-16 rounded-full pointer-events-none" style={{ background: C.blue, opacity: 0.10 }} />
        <div className="absolute bottom-4 right-[22%] w-24 h-24 rounded-full pointer-events-none" style={{ background: C.moss, opacity: 0.14 }} />

        <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center max-w-7xl mx-auto">
          <div style={{ animation: "fadeInUp .55s ease-out both" }}>
            <div className="flex flex-wrap gap-2.5 mb-6">
              <Sticker bg={C.sun} rotate={-4}>🔥 racha de logros</Sticker>
              <Sticker bg={C.moss} rotate={3}>100% gratis</Sticker>
            </div>
            <h1 className="font-['Space_Grotesk'] font-extrabold leading-[1.02] mb-4" style={{ fontSize: "clamp(38px,4.6vw,60px)", color: C.navy, maxWidth: 560, letterSpacing: "-0.02em" }}>
              Maneja tu dinero{" "}
              <span className="relative inline-block" style={{ color: C.blue }}>
                sin miedo
                <svg className="absolute left-0 -bottom-2 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M2 7 Q50 -2 100 6 T198 5" stroke={C.mandarin} strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-[16px] leading-[1.7] mb-8" style={{ color: C.navySoft, maxWidth: 420, fontFamily: "'Inter',sans-serif" }}>
              Registra ingresos, controla gastos y sube de nivel aprendiendo finanzas.
              Cero bancos reales, cero riesgo — puro juego que sí te prepara para la vida real.
            </p>
            <div className="flex flex-wrap gap-3.5 mb-9">
              <button
                onClick={() => onNavigate("registro")}
                className="gummy group px-7 py-3.5 rounded-2xl text-[15px] font-extrabold font-['Space_Grotesk'] border-2 cursor-pointer flex items-center gap-2"
                style={{ background: C.mandarin, color: "white", borderColor: C.navy, "--g-shadow": C.navy } as CSSProperties}
              >
                Empieza gratis
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("acerca")}
                className="gummy px-7 py-3.5 rounded-2xl text-[15px] font-bold font-['Space_Grotesk'] border-2 cursor-pointer"
                style={{ background: "white", color: C.navy, borderColor: C.navy, "--g-shadow": C.navy } as CSSProperties}
              >
                Conoce el proyecto
              </button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full" style={{ background: C.sun, opacity: 0.16 }} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Beto size={190} mood="wave" />
              <div className="px-4 py-2 rounded-2xl font-['Space_Grotesk'] font-bold text-[13px] text-center" style={{ background: "white", color: C.navy, border: `2.5px solid ${C.navy}`, boxShadow: `0 5px 0 ${C.navy}20` }}>
                ¡Hola! Soy Beto 👋 <br /><span style={{ color: C.slate, fontWeight: 500, fontSize: 11 }}>tu guía en BETA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ola fill={C.navy} />

      <section className="px-10 lg:px-16 pt-10 pb-16 relative" style={{ background: C.navy }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
          <div>
            <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2" style={{ color: C.turquoise }}>Quiénes somos</p>
            <h2 className="font-['Space_Grotesk'] font-bold text-[26px] mb-3 leading-snug" style={{ color: "white" }}>
              Educación financiera que no se siente como tarea
            </h2>
            <p className="text-[14px] leading-[1.75] mb-6" style={{ color: "#B9C7D6", maxWidth: 440 }}>
              Somos estudiantes de la UT Cancún que creen que aprender a administrar el dinero
              no debe ser aburrido. BETA nació para demostrarlo: retos, rachas y niveles —
              todo para que sí termines lo que empiezas.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { n: "16–20", l: "Edad objetivo", bg: C.sun },
                { n: "ODS 4", l: "Educación de calidad", bg: C.moss },
                { n: "100%", l: "Gratis, siempre", bg: C.turquoise },
              ].map((s, i) => (
                <div key={s.n} className="rounded-2xl px-4 py-3 border-2" style={{ background: "rgba(255,255,255,0.06)", borderColor: s.bg, animation: `popIn .4s ease-out ${i * 0.1}s both` }}>
                  <div className="font-['Space_Grotesk'] font-extrabold text-[19px]" style={{ color: s.bg }}>{s.n}</div>
                  <div className="text-[10px]" style={{ color: "#8DA3B8" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-6 border-2" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.14)" }}>
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#8DA3B8" }}>Tu recorrido en BETA</span>
              <Sticker bg={C.sun} rotate={4}><Flame size={11} /> 4 pasos</Sticker>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {senderoPasos.map((p, i) => (
                <div key={p.label} className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center border-2" style={{ background: p.bg, borderColor: p.color, animation: `popIn .4s ease-out ${i * 0.12}s both` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "white" }}>
                    <p.Icon size={20} color={p.color} strokeWidth={2.3} />
                  </div>
                  <span className="font-['Space_Grotesk'] font-bold text-[12px]" style={{ color: C.navy }}>{i + 1}. {p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Ola fill={C.cream} flip />

      <section className="px-10 lg:px-16 pt-10 pb-16" style={{ background: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2" style={{ color: C.mandarin }}>Qué ofrecemos</p>
          <h2 className="font-['Space_Grotesk'] font-bold text-[28px] mb-8" style={{ color: C.navy }}>Todo en un solo lugar</h2>
          <div className="flex flex-col gap-5 max-w-2xl mx-auto">
            {ofertas.map((o, idx) => {
              const isActive = activeCard === idx;
              const isLarge = o.size === "lg";
              return (
                <div
                  key={o.title}
                  onClick={() => setActiveCard(isActive ? null : idx)}
                  className={`bento-card relative cursor-pointer border-[3px] overflow-hidden w-full ${isLarge ? "flex flex-col justify-between p-8" : "flex items-center gap-5 p-6"}`}
                  style={{
                    background: o.bg,
                    borderColor: o.border,
                    borderRadius: isLarge ? "64px 64px 64px 28px" : "999px",
                    boxShadow: isActive ? `0 14px 0 ${o.border}50` : `0 8px 0 ${o.border}35`,
                    minHeight: isLarge ? 300 : 150,
                  }}
                >
                  {/* ilustraciones circulares decorativas */}
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: o.border, opacity: 0.12 }} />
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full pointer-events-none" style={{ background: o.accent, opacity: 0.10 }} />
                  {isLarge && <div className="absolute top-[38%] right-6 w-3 h-3 rounded-full pointer-events-none" style={{ background: o.accent, opacity: 0.4, animation: "float1 4s ease-in-out infinite" }} />}

                  {o.badge && (
                    <div className="absolute -top-3 -right-3 z-10" style={{ animation: "float2 3.2s ease-in-out infinite" }}>
                      <Sticker bg={C.mandarin} rotate={8}>{o.badge}</Sticker>
                    </div>
                  )}

                  {isLarge ? (
                    <>
                      <div className="relative z-10 flex items-start gap-4">
                        <RingProgress value={isActive ? o.progress : 0} color={o.accent} size={64} stroke={6}>
                          <div className="w-11 h-11 rounded-full flex items-center justify-center border-2" style={{ background: "white", borderColor: o.border }}>
                            <o.Icon size={22} color={o.accent} strokeWidth={2.2} />
                          </div>
                        </RingProgress>
                        <div className="flex-1">
                          <h3 className="font-['Space_Grotesk'] font-extrabold mb-1.5" style={{ color: o.accent, fontSize: 23 }}>{o.title}</h3>
                          <p className="text-[13px] leading-[1.65]" style={{ color: C.navySoft, maxWidth: 300 }}>{o.desc}</p>
                        </div>
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${isActive ? "max-h-16 opacity-100 mb-3" : "max-h-0 opacity-0 mb-0"}`}>
                          {o.chips.map((c) => (
                            <span key={c} className="text-[10.5px] font-bold px-3 py-1.5 rounded-full border-2" style={{ color: o.accent, borderColor: o.border, background: "white" }}>{c}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold" style={{ color: o.accent }}>{isActive ? `${o.progress}% · ${o.progressLabel}` : "Toca para ver más"}</span>
                          <button onClick={(e) => { e.stopPropagation(); onNavigate("registro"); }} className="flex items-center gap-1.5 font-['Space_Grotesk'] font-bold text-[13px] rounded-full px-4 py-2 border-2 transition-transform hover:scale-105" style={{ color: "white", background: o.accent, borderColor: o.border }}>
                            Probar simulador <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <RingProgress value={isActive ? o.progress : 0} color={o.accent} size={58} stroke={5}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2" style={{ background: "white", borderColor: o.border }}>
                          <o.Icon size={19} color={o.accent} strokeWidth={2.2} />
                        </div>
                      </RingProgress>
                      <div className="relative z-10 flex-1 min-w-0">
                        <h3 className="font-['Space_Grotesk'] font-extrabold mb-1" style={{ color: o.accent, fontSize: 17 }}>{o.title}</h3>
                        <p className="text-[12.5px] leading-[1.55]" style={{ color: C.navySoft }}>{o.desc}</p>
                        <div className={`flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 ${isActive ? "max-h-10 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
                          {o.chips.map((c) => (
                            <span key={c} className="text-[9.5px] font-bold px-2.5 py-1 rounded-full border-2" style={{ color: o.accent, borderColor: o.border, background: "white" }}>{c}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Ola fill={C.sun} />

      <section className="px-10 lg:px-16 pt-10 pb-16 relative overflow-hidden" style={{ background: C.sun }}>
        <Star size={20} color="white" className="absolute top-10 left-[15%] opacity-60" style={{ animation: "float1 4s ease-in-out infinite" }} />
        <Sparkles size={24} color="white" className="absolute bottom-10 left-[42%] opacity-50" style={{ animation: "sparkleSpin 7s linear infinite" }} />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-6">
            <Beto size={110} mood="cheer" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PartyPopper size={18} color={C.navy} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#8A5B00" }}>Empieza hoy</span>
              </div>
              <h2 className="font-['Space_Grotesk'] font-extrabold text-[28px] lg:text-[32px] mb-1" style={{ color: C.navy }}>¿Listo para tomar el control?</h2>
              <p className="text-[14px] leading-[1.6]" style={{ color: "#5F4300", maxWidth: 400 }}>Sin bancos reales, sin riesgo — solo aprendizaje que se siente como avanzar de nivel.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("registro")}
            className="gummy flex-shrink-0 px-8 py-4 rounded-2xl text-[15px] font-extrabold font-['Space_Grotesk'] border-2 cursor-pointer whitespace-nowrap flex items-center gap-2"
            style={{ background: C.navy, color: C.cream, borderColor: C.navy, "--g-shadow": "#0A1826" } as CSSProperties}
          >
            Registrarse o acceder <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="flex items-center justify-between px-8 py-3 flex-shrink-0" style={{ background: "white", borderTop: "2px solid rgba(18,38,58,0.06)" }}>
        <a href="mailto:beta@example.com" className="flex items-center gap-2 text-[12px] font-bold transition-colors hover:opacity-70" style={{ color: C.slate }}><Mail size={14} /> betaequipo@betafinanzas.mx</a>
        <div className="flex flex-col items-center"><BetaLogo size={22} /><span className="text-[10px] font-bold mt-0.5" style={{ color: C.blue }}>BETA: Finanzas para los Jóvenes</span></div>
        <button onClick={() => onNavigate("contacto")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: `2px solid ${C.navy}20`, color: C.slate }} title="Ayuda y Soporte"><HelpCircle size={16} /></button>
      </footer>
    </main>
  );
}