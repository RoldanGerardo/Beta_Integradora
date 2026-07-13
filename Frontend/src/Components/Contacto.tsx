import { useState } from "react";
import { Sparkles, Mail, Check, ArrowRight, Activity, Info, ChevronRight } from "lucide-react";
import BetaLogo from "./BetaLogo";
import { Sticker } from "./Ilustraciones.tsx";
import { C } from "./theme.ts";
import type { CSSProperties, FormEvent } from "react";

type Props = {
  onNavigate: (vista: string) => void;
};

const faqsBeta = [
  { q: "¿BETA se conecta con mi banco de verdad?", a: "No. BETA es 100% un simulador: los movimientos que registras son datos de práctica y nunca se conectan a cuentas bancarias reales ni a tu dinero real." },
  { q: "¿Cuánto cuesta usar la plataforma?", a: "Nada. BETA es y será siempre gratuito para estudiantes; es un proyecto educativo, no un producto comercial." },
  { q: "¿Cómo se calculan mis reportes quincenales y mensuales?", a: "Sumamos tus ingresos y egresos registrados dentro del rango de fechas elegido y calculamos la diferencia, para que veas tu balance real de ese periodo." },
  { q: "¿Puedo usar BETA desde mi celular?", a: "Sí, la plataforma está pensada para verse bien tanto en computadora como en dispositivos móviles." },
  { q: "¿Mis datos están seguros?", a: "No pedimos información financiera sensible. Solo usamos tu correo y usuario para identificarte dentro de la plataforma." },
];

type FaqItemProps = {
  item: { q: string; a: string };
  abierto: boolean;
  onToggle: () => void;
  color: string;
};

function FaqItem({ item, abierto, onToggle, color }: FaqItemProps) {
  return (
    <div className="rounded-2xl border-2 overflow-hidden bg-white transition-colors duration-200" style={{ borderColor: abierto ? color : "rgba(18,38,58,0.10)" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="font-['Space_Grotesk'] font-bold text-[13.5px]" style={{ color: C.navy }}>{item.q}</span>
        <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200" style={{ color, transform: abierto ? "rotate(90deg)" : "rotate(0)" }} />
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: abierto ? 200 : 0 }}>
        <p className="px-5 pb-4 text-[12.5px] leading-[1.7]" style={{ color: C.navySoft, fontFamily: "'Inter',sans-serif" }}>{item.a}</p>
      </div>
    </div>
  );
}

export default function Contacto({ onNavigate }: Props) {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [faqAbierta, setFaqAbierta] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.email || !form.mensaje) {
      setError("Por favor completa nombre, correo y mensaje.");
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
      setTimeout(() => setEnviado(false), 4500);
    }, 1100);
  };

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes checkPop { 0% { transform: scale(.6); opacity:0; } 60% { transform: scale(1.15); opacity:1; } 100% { transform: scale(1); opacity:1; } }
        @keyframes sparkleSpin { to { transform: rotate(360deg); } }
        .gummy7 { box-shadow: 0 6px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy7:hover { transform: translateY(-3px); box-shadow: 0 9px 0 var(--g,#12263A); }
        .gummy7:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g,#12263A); }
      `}</style>

      <section className="relative overflow-hidden px-10 lg:px-16 pt-14 pb-10" style={{ background: `linear-gradient(170deg, ${C.creamDeep} 0%, ${C.cream} 60%)` }}>
        <Sparkles size={22} color={C.turquoise} className="absolute top-14 right-[10%] opacity-60" style={{ animation: "sparkleSpin 6s linear infinite" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center" style={{ animation: "fadeInUp .5s ease-out both" }}>
          <div className="flex justify-center mb-5"><Sticker bg={C.moss} rotate={-3}>💬 Estamos para ayudarte</Sticker></div>
          <h1 className="font-['Space_Grotesk'] font-extrabold leading-[1.1] mb-4" style={{ fontSize: "clamp(28px,4vw,40px)", color: C.navy }}>¿Dudas, ideas o sugerencias?</h1>
          <p className="text-[14px] leading-[1.7] max-w-xl mx-auto" style={{ color: C.navySoft, fontFamily: "'Inter',sans-serif" }}>
            Escríbenos y te respondemos en menos de 48 horas. Este es un proyecto vivo que crece con lo que tú nos cuentes.
          </p>
        </div>
      </section>

      <section className="px-10 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white rounded-[32px] p-8 border-[3px]" style={{ borderColor: C.navy }}>
            <h2 className="font-['Space_Grotesk'] font-extrabold text-[19px] mb-1" style={{ color: C.navy }}>Envíanos un mensaje</h2>
            <p className="text-[12.5px] mb-6" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Los campos con * son obligatorios.</p>

            {error && <div className="mb-4 px-4 py-2.5 rounded-xl text-[12px] font-semibold" style={{ background: "rgba(248,145,12,0.12)", color: "#AE6D21", border: "1px solid rgba(248,145,12,0.25)" }}>⚠️ {error}</div>}
            {enviado && (
              <div className="mb-4 px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2" style={{ background: "rgba(132,209,117,0.18)", color: "#3D7A41", border: "1px solid rgba(132,209,117,0.4)", animation: "checkPop .35s ease-out" }}>
                <Check size={14} /> ¡Mensaje enviado! Te responderemos pronto.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Nombre *</label>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = C.moss)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Correo *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = C.moss)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Asunto</label>
                <input
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  placeholder="¿De qué se trata?"
                  className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                  style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = C.moss)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Mensaje *</label>
                <textarea
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="Cuéntanos en qué te podemos ayudar..."
                  rows={4}
                  className="w-full py-2 text-[13px] bg-transparent outline-none resize-none transition-colors duration-150"
                  style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderBottomColor = C.moss)}
                  onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="gummy7 w-full py-3.5 rounded-2xl font-['Space_Grotesk'] font-extrabold text-[14px] flex items-center justify-center gap-2 border-2"
                style={{ background: enviando ? C.slate : C.mandarin, color: "white", borderColor: C.navy, "--g": C.navy } as CSSProperties}
              >
                {enviando ? "Enviando..." : <>Enviar mensaje <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-[28px] p-6 border-2 flex items-center gap-4" style={{ background: "#DCEBFB", borderColor: C.blue }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}><Mail size={20} color={C.blue} /></div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#2C46D6" }}>Correo</div>
                <a href="mailto:betaequipo@betafinanzas.mx" className="text-[13px] font-bold hover:underline" style={{ color: C.navy }}>betaequipo@betafinanzas.mx</a>
              </div>
            </div>
            <div className="rounded-[28px] p-6 border-2 flex items-center gap-4" style={{ background: "#E4F7E1", borderColor: C.moss }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}><Activity size={20} color={C.mossDeep} /></div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#3D7A41" }}>WhatsApp</div>
                <span className="text-[13px] font-bold" style={{ color: C.navy }}>+52 998 123 4567</span>
              </div>
            </div>
            <div className="rounded-[28px] p-6 border-2 flex items-center gap-4" style={{ background: C.creamDeep, borderColor: C.mandarin }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}><Info size={20} color={C.mandarin} /></div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#AE6D21" }}>Ubicación</div>
                <span className="text-[13px] font-bold" style={{ color: C.navy }}>UT Cancún, Quintana Roo, México</span>
              </div>
            </div>
            <div className="rounded-[28px] p-6 border-2" style={{ background: C.navy, borderColor: C.navy }}>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: C.turquoise }}>Síguenos</div>
              <div className="flex flex-wrap gap-2">
                {["Instagram", "TikTok", "X"].map((r) => (
                  <span key={r} className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>{r}: @beta.finanzas</span>
                ))}
              </div>
              <p className="text-[11px] mt-3" style={{ color: "#8DA3B8" }}>Horario de atención: Lun–Vie, 9:00–18:00 (hora de Cancún)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-10 lg:px-16 pb-16" style={{ background: C.cream }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2 text-center" style={{ color: C.mandarin }}>Preguntas frecuentes</p>
          <h2 className="font-['Space_Grotesk'] font-bold text-[24px] mb-8 text-center" style={{ color: C.navy }}>Lo que más nos preguntan</h2>
          <div className="space-y-3">
            {faqsBeta.map((item, i) => (
              <FaqItem key={item.q} item={item} abierto={faqAbierta === i} onToggle={() => setFaqAbierta(faqAbierta === i ? -1 : i)} color={C.blue} />
            ))}
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between px-8 py-3 flex-shrink-0" style={{ background: "white", borderTop: "2px solid rgba(18,38,58,0.06)" }}>
        <a href="mailto:beta@example.com" className="flex items-center gap-2 text-[12px] font-bold transition-colors hover:opacity-70" style={{ color: C.slate }}><Mail size={14} /> beta@example.com</a>
        <div className="flex flex-col items-center"><BetaLogo size={22} /><span className="text-[10px] font-bold mt-0.5" style={{ color: C.blue }}>BETA: Finanzas para los Jóvenes</span></div>
        <button onClick={() => onNavigate("acerca")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ border: `2px solid ${C.navy}20`, color: C.slate }} title="Sobre nosotros"><Info size={16} /></button>
      </footer>
    </main>
  );
}