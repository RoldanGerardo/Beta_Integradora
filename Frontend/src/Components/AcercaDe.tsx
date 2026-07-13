import { Star, ArrowRight, Target, Flame, CheckCircle, Sparkles, Mail, HelpCircle } from "lucide-react";
import BetaLogo from "./BetaLogo";
import {Beto, Ola, Sticker} from "./Ilustraciones.tsx";
import { C } from "./theme.ts";
import type { CSSProperties } from "react";

type Props = {
  onNavigate: (vista: string) => void;
};

const valoresBeta = [
  { Icon: Target, title: "Claridad", desc: "Nada de jerga bancaria. Explicamos el dinero con palabras que sí se entienden.", color: C.blue, bg: "#DCEBFB" },
  { Icon: Flame, title: "Constancia", desc: "Rachas, niveles y retos para que el hábito del ahorro se quede contigo.", color: C.mandarin, bg: C.creamDeep },
  { Icon: CheckCircle, title: "Confianza", desc: "Sin bancos reales ni datos financieros sensibles: practicas sin ningún riesgo.", color: C.moss, bg: "#E4F7E1" },
  { Icon: Sparkles, title: "Diversión", desc: "Aprender finanzas puede sentirse como jugar, y así es como lo hicimos.", color: C.turquoise, bg: "#DDF6F7" },
];

const equipoBeta = [
  { nombre: "Nikte Hernández", rol: "Producto y UX", emoji: "🎨", color: C.blue },
  { nombre: "Marcos Martín", rol: "Desarrollo Frontend", emoji: "💻", color: C.mandarin },
  { nombre: "Gerardo Roldán", rol: "Desarrollo Backend", emoji: "🛠️", color: C.mossDeep },
  { nombre: "Aragon Ku", rol: "Contenido educativo", emoji: "📚", color: C.turquoise },
];

const hitosBeta = [
  { año: "2025", texto: "BETA nace como proyecto final en la UT Cancún, ingeniería en desarrollo de software." },
  { año: "2026", texto: "Primer simulador funcional: ingresos, egresos y reportes en tiempo real." },
  { año: "Próximamente", texto: "Cuestionarios, insignias y retos semanales para todo el módulo educativo." },
];

export default function AcercaDe({ onNavigate }: Props) {
  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream }}>
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes betoBob { 0%,100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-10px) rotate(1.5deg); } }
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
        .gummy6 { box-shadow: 0 6px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy6:hover { transform: translateY(-3px); box-shadow: 0 9px 0 var(--g,#12263A); }
        .gummy6:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g,#12263A); }
        .bento-card { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease; }
        .bento-card:hover { transform: translateY(-6px) rotate(-0.6deg); }
      `}</style>

      <section className="relative overflow-hidden px-10 lg:px-16 pt-14 pb-10" style={{ background: `linear-gradient(170deg, ${C.creamDeep} 0%, ${C.cream} 60%)` }}>
        <Star size={20} color={C.mandarin} className="absolute top-20 left-[10%] opacity-60" style={{ animation: "float1 5s ease-in-out infinite" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center" style={{ animation: "fadeInUp .5s ease-out both" }}>
          <div className="flex justify-center mb-5"><Sticker bg={C.sun} rotate={-3}>✨ Sobre BETA</Sticker></div>
          <h1 className="font-['Space_Grotesk'] font-extrabold leading-[1.1] mb-4" style={{ fontSize: "clamp(30px,4vw,44px)", color: C.navy }}>
            Un simulador financiero hecho <span style={{ color: C.blue }}>por jóvenes</span>, para jóvenes
          </h1>
          <p className="text-[15px] leading-[1.75] max-w-2xl mx-auto" style={{ color: C.navySoft, fontFamily: "'Inter',sans-serif" }}>
            BETA es un proyecto estudiantil que combina finanzas personales y gamificación
            para que aprender a manejar el dinero se sienta natural, seguro y hasta divertido.
          </p>
          <div className="flex justify-center mt-8"><Beto size={130} mood="cheer" /></div>
        </div>
      </section>

      <Ola fill={C.navy} />

      <section className="px-10 lg:px-16 pt-10 pb-16" style={{ background: C.navy }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2" style={{ color: C.turquoise }}>Nuestra misión</p>
            <h2 className="font-['Space_Grotesk'] font-bold text-[26px] mb-3 leading-snug" style={{ color: "white" }}>
              Que nadie llegue a los 20 sin saber administrar su dinero
            </h2>
            <p className="text-[14px] leading-[1.75] mb-6" style={{ color: "#B9C7D6", maxWidth: 460 }}>
              Nacimos como proyecto de la Universidad Tecnológica de Cancún con un objetivo claro:
              cerrar la brecha de educación financiera entre los jóvenes mexicanos. Creemos que
              practicar con dinero simulado, antes de manejar dinero real, hace toda la diferencia.
            </p>
            <div className="flex flex-wrap gap-3">
              {[{ n: "16–20", l: "Edad objetivo" }, { n: "ODS 4", l: "Educación de calidad" }, { n: "100%", l: "Gratis, siempre" }].map((s, i) => (
                <div key={s.n} className="rounded-2xl px-4 py-3 border-2" style={{ background: "rgba(255,255,255,0.06)", borderColor: C.sun, animation: `popIn .4s ease-out ${i * 0.1}s both` }}>
                  <div className="font-['Space_Grotesk'] font-extrabold text-[19px]" style={{ color: C.sun }}>{s.n}</div>
                  <div className="text-[10px]" style={{ color: "#8DA3B8" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-6 border-2 space-y-1" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.14)" }}>
            <span className="text-[11px] font-bold uppercase tracking-widest px-1" style={{ color: "#8DA3B8" }}>Cómo llegamos aquí</span>
            {hitosBeta.map((h, i) => (
              <div key={h.año} className="flex gap-4 pt-3" style={{ animation: `fadeInUp .4s ease-out ${i * 0.1}s both` }}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full" style={{ background: C.sun }} />
                  {i < hitosBeta.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: "rgba(255,255,255,0.15)" }} />}
                </div>
                <div className="pb-2">
                  <div className="font-['Space_Grotesk'] font-bold text-[13px]" style={{ color: C.sun }}>{h.año}</div>
                  <p className="text-[12.5px] leading-[1.6]" style={{ color: "#C7D4DE" }}>{h.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ola fill={C.cream} flip />

      <section className="px-10 lg:px-16 pt-10 pb-16" style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2 text-center" style={{ color: C.mandarin }}>Lo que nos mueve</p>
          <h2 className="font-['Space_Grotesk'] font-bold text-[26px] mb-8 text-center" style={{ color: C.navy }}>Nuestros valores</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valoresBeta.map((v, i) => (
              <div key={v.title} className="bento-card rounded-[28px] p-6 border-[3px] flex flex-col items-center text-center gap-3" style={{ background: v.bg, borderColor: v.color, animation: `popIn .4s ease-out ${i * 0.08}s both` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "white" }}><v.Icon size={22} color={v.color} strokeWidth={2.2} /></div>
                <h3 className="font-['Space_Grotesk'] font-extrabold text-[14px]" style={{ color: C.navy }}>{v.title}</h3>
                <p className="text-[12px] leading-[1.6]" style={{ color: C.navySoft }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 lg:px-16 pt-2 pb-16" style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[12px] font-bold tracking-[.16em] uppercase mb-2 text-center" style={{ color: C.blue }}>Quién está detrás</p>
          <h2 className="font-['Space_Grotesk'] font-bold text-[26px] mb-8 text-center" style={{ color: C.navy }}>El equipo BETA</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {equipoBeta.map((m, i) => (
              <div key={m.nombre} className="bento-card rounded-[28px] p-6 bg-white border-[3px] flex flex-col items-center text-center gap-2" style={{ borderColor: m.color, animation: `popIn .4s ease-out ${i * 0.08}s both` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-[26px]" style={{ background: `${m.color}1A`, border: `2px solid ${m.color}` }}>{m.emoji}</div>
                <h3 className="font-['Space_Grotesk'] font-extrabold text-[14px]" style={{ color: C.navy }}>{m.nombre}</h3>
                <p className="text-[11.5px] font-semibold" style={{ color: m.color }}>{m.rol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 lg:px-16 pt-10 pb-16 relative overflow-hidden" style={{ background: C.sun }}>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-6">
            <Beto size={100} mood="wave" />
            <div>
              <h2 className="font-['Space_Grotesk'] font-extrabold text-[24px] mb-1" style={{ color: C.navy }}>¿Tienes dudas o ideas para BETA?</h2>
              <p className="text-[13px]" style={{ color: "#5F4300" }}>Nos encantaría escucharte.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("contacto")}
            className="gummy6 flex-shrink-0 px-8 py-4 rounded-2xl text-[15px] font-extrabold font-['Space_Grotesk'] border-2 cursor-pointer flex items-center gap-2"
            style={{ background: C.navy, color: C.cream, borderColor: C.navy, "--g": "#0A1826" } as CSSProperties}
          >
            Contáctanos <ArrowRight size={17} />
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
