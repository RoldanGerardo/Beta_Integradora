import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowLeft, X, Sparkles, Trophy, CheckCircle2,
  Lightbulb, Compass, ListChecks, BookMarked, TrendingUp, Clock, RotateCcw,
} from "lucide-react";
import { Beto, Ola, Sticker, RingProgress, PatternDots } from "./Ilustraciones";
import { C } from "./theme";
import {
  CUESTIONARIOS,
  obtenerCuestionario,
  obtenerNivel,
  puntajeMaximo,
  cargarProgreso,
  guardarProgreso,
  type Cuestionario,
  type NivelResultado,
  type ProgresoGuardado,
} from "../data/cuestionarios";

type Props = {
  onNavigate?: (vista: string) => void;
};

type Etapa = "hub" | "jugando" | "resultado";

export default function Cuestionarios({ onNavigate }: Props) {
  const [etapa, setEtapa] = useState<Etapa>("hub");
  const [activoId, setActivoId] = useState<string | null>(null);
  const [ultimoPuntaje, setUltimoPuntaje] = useState<number>(0);
  const [progreso, setProgreso] = useState<Record<string, ProgresoGuardado>>({});

  useEffect(() => {
    setProgreso(cargarProgreso());
  }, []);

  const activo = activoId ? obtenerCuestionario(activoId) : undefined;

  function empezar(id: string) {
    setActivoId(id);
    setEtapa("jugando");
  }

  function terminarCuestionario(id: string, puntaje: number) {
    const cuestionario = obtenerCuestionario(id);
    if (!cuestionario) return;
    guardarProgreso(id, {
      puntaje,
      puntajeMax: puntajeMaximo(cuestionario),
      fecha: new Date().toISOString(),
    });
    setProgreso(cargarProgreso());
    setUltimoPuntaje(puntaje);
    setEtapa("resultado");
  }

  function volverAlHub() {
    setEtapa("hub");
    setActivoId(null);
  }

  if (etapa === "jugando" && activo) {
    return (
      <JugadorCuestionario
        cuestionario={activo}
        onSalir={volverAlHub}
        onTerminar={(puntaje) => terminarCuestionario(activo.id, puntaje)}
      />
    );
  }

  if (etapa === "resultado" && activo) {
    return (
      <PantallaResultado
        cuestionario={activo}
        puntaje={ultimoPuntaje}
        onVolver={volverAlHub}
        onRepetir={() => empezar(activo.id)}
      />
    );
  }

  return <HubCuestionarios progreso={progreso} onEmpezar={empezar} onNavigate={onNavigate} />;
}

// ════════════════════════════════════════════════════════════
// HUB — listado principal de cuestionarios
// ════════════════════════════════════════════════════════════

type HubProps = {
  progreso: Record<string, ProgresoGuardado>;
  onEmpezar: (id: string) => void;
  onNavigate?: (vista: string) => void;
};

function HubCuestionarios({ progreso, onEmpezar, onNavigate }: HubProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todas");

  const categorias = useMemo(() => {
    const set = new Set<string>();
    CUESTIONARIOS.forEach((c) => set.add(c.categoria));
    return ["Todas", ...Array.from(set)];
  }, []);

  const filtrados = useMemo(() => {
    if (categoriaActiva === "Todas") return CUESTIONARIOS;
    return CUESTIONARIOS.filter((c) => c.categoria === categoriaActiva);
  }, [categoriaActiva]);

  const completados = Object.keys(progreso).length;
  const totalCuestionarios = CUESTIONARIOS.length;
  const porcentajeGeneral = Math.round((completados / totalCuestionarios) * 100);

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popIn { from { opacity:0; transform: scale(.94); } to { opacity:1; transform: scale(1); } }
        @keyframes betaBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .beta-cuest-scroll::-webkit-scrollbar { height: 6px; }
        .beta-cuest-scroll::-webkit-scrollbar-thumb { background: rgba(18,38,58,0.15); border-radius: 999px; }
      `}</style>

      <div className="relative overflow-hidden" style={{ background: C.navy }}>
        <PatternDots color="#FFFFFF" opacity={0.05} size={20} />
        <div className="relative px-8 pt-10 pb-14 max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <Beto size={72} mood="cheer" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-['Space_Grotesk'] font-extrabold text-[26px] text-white">Cuestionarios</h1>
                <Sticker bg={C.sun} rotate={-4}>Reflexiona y descubre</Sticker>
              </div>
              <p className="text-[13.5px] max-w-md" style={{ color: "#9FB4C4" }}>
                Nueve momentos cortos para conocer mejor tu relación con el dinero. Sin exámenes, sin presión, solo tú y Beto pensando en voz alta.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.06] rounded-3xl px-5 py-4 border border-white/10 flex-shrink-0">
            <RingProgress value={porcentajeGeneral} color={C.sun} track="rgba(255,255,255,0.12)" size={64} stroke={7}>
              <span className="font-['Space_Grotesk'] font-extrabold text-[14px] text-white">{porcentajeGeneral}%</span>
            </RingProgress>
            <div>
              <div className="text-[12px] font-bold text-white">{completados} de {totalCuestionarios} completados</div>
              <div className="text-[11px]" style={{ color: "#9FB4C4" }}>
                {completados === 0 ? "Empieza con el que más te llame la atención" : completados === totalCuestionarios ? "¡Los completaste todos! 🎉" : "Sigue así, vas muy bien"}
              </div>
            </div>
          </div>
        </div>
        <Ola fill={C.cream} />
      </div>

      <div className="px-8 pb-14 max-w-7xl mx-auto -mt-2">
        <div className="flex items-center gap-2 overflow-x-auto beta-cuest-scroll pb-2 mb-6">
          {categorias.map((cat) => {
            const activa = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="flex-shrink-0 text-[12px] font-bold px-3.5 py-1.5 rounded-full border-2 transition-all duration-150"
                style={{
                  background: activa ? C.navy : "white",
                  color: activa ? "white" : C.navy,
                  borderColor: activa ? C.navy : "rgba(18,38,58,0.12)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map((c, i) => (
            <div key={c.id} style={{ animation: `popIn .35s ease-out ${Math.min(i, 8) * 0.05}s both` }}>
              <TarjetaCuestionario cuestionario={c} progreso={progreso[c.id]} onEmpezar={() => onEmpezar(c.id)} />
            </div>
          ))}
        </div>

        {completados > 0 && (
          <div
            className="mt-8 flex items-center justify-between gap-3 rounded-2xl p-4 border-2 flex-wrap"
            style={{ background: C.creamDeep, borderColor: C.sun }}
          >
            <div className="flex items-center gap-3">
              <Trophy size={18} color="#8A5B00" />
              <p className="text-[12.5px] font-semibold" style={{ color: C.navy }}>
                ¿Ya leíste los artículos relacionados con tus resultados? Ahí profundizamos cada tema.
              </p>
            </div>
            <button
              onClick={() => onNavigate?.("articulos")}
              className="flex-shrink-0 text-[11.5px] font-bold px-3.5 py-2 rounded-full text-white transition-transform hover:scale-105 active:scale-95"
              style={{ background: C.navy }}
            >
              Ir a artículos
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

type TarjetaCuestionarioProps = {
  cuestionario: Cuestionario;
  progreso?: ProgresoGuardado;
  onEmpezar: () => void;
};

function TarjetaCuestionario({ cuestionario, progreso, onEmpezar }: TarjetaCuestionarioProps) {
  const { Icon } = cuestionario;
  const completado = !!progreso;
  const porcentaje = completado ? Math.round((progreso.puntaje / progreso.puntajeMax) * 100) : 0;

  return (
    <button
      onClick={onEmpezar}
      className="group w-full text-left rounded-[28px] bg-white border-[3px] p-5 transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
      style={{ borderColor: "rgba(18,38,58,0.08)", boxShadow: "0 10px 24px -18px rgba(15,33,56,0.35)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: cuestionario.bg }}
        >
          <Icon size={22} color={cuestionario.color} strokeWidth={2.3} />
        </div>
        {completado ? (
          <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#E4F7E1", color: C.mossDeep }}>
            <CheckCircle2 size={12} /> Completado
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(18,38,58,0.05)", color: C.slate }}>
            <Clock size={11} /> {cuestionario.minutos} min
          </div>
        )}
      </div>

      <span
        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2"
        style={{ background: `${cuestionario.color}1E`, color: cuestionario.color }}
      >
        {cuestionario.categoria}
      </span>

      <h3 className="font-['Space_Grotesk'] font-extrabold text-[15.5px] leading-snug mb-1.5" style={{ color: C.navy }}>
        {cuestionario.titulo}
      </h3>
      <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: C.slate }}>
        {cuestionario.descripcionCorta}
      </p>

      {completado && (
        <div className="mb-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(18,38,58,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${porcentaje}%`, background: cuestionario.color }} />
          </div>
        </div>
      )}

      <span
        className="inline-flex items-center gap-1 text-[12px] font-bold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: cuestionario.color }}
      >
        {completado ? "Ver resultado de nuevo" : "Empezar"} <ArrowRight size={13} />
      </span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// JUGADOR — flujo de preguntas
// ════════════════════════════════════════════════════════════

type JugadorProps = {
  cuestionario: Cuestionario;
  onSalir: () => void;
  onTerminar: (puntaje: number) => void;
};

function JugadorCuestionario({ cuestionario, onSalir, onTerminar }: JugadorProps) {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  const pregunta = cuestionario.preguntas[indice];
  const totalPreguntas = cuestionario.preguntas.length;
  const avance = ((indice + (seleccionada !== null ? 1 : 0)) / totalPreguntas) * 100;

  function elegirOpcion(puntos: number, opcionIndex: number) {
    if (seleccionada !== null) return;
    setSeleccionada(opcionIndex);
    setTimeout(() => {
      const nuevas = [...respuestas, puntos];
      if (indice + 1 < totalPreguntas) {
        setRespuestas(nuevas);
        setIndice(indice + 1);
        setSeleccionada(null);
      } else {
        const puntajeFinal = nuevas.reduce((a, b) => a + b, 0);
        onTerminar(puntajeFinal);
      }
    }, 420);
  }

  return (
    <main className="flex-1 min-h-screen flex flex-col items-center relative" style={{ background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popCheck { from { transform: scale(0); } 60% { transform: scale(1.15); } to { transform: scale(1); } }
      `}</style>

      <div className="w-full px-8 pt-6 max-w-2xl mx-auto flex items-center gap-4">
        <button onClick={onSalir} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-black/5 transition-colors">
          <X size={17} color={C.navy} />
        </button>
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(18,38,58,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${avance}%`, background: cuestionario.color }} />
        </div>
        <span className="text-[11.5px] font-bold flex-shrink-0" style={{ color: C.slate }}>{indice + 1}/{totalPreguntas}</span>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center px-8 max-w-2xl mx-auto">
        <div key={pregunta.id} className="w-full" style={{ animation: "fadeInUp .35s ease-out both" }}>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{ background: `${cuestionario.color}1E`, color: cuestionario.color }}
            >
              {cuestionario.categoria}
            </span>
          </div>
          <h2 className="font-['Space_Grotesk'] font-extrabold text-[22px] text-center leading-snug mb-8" style={{ color: C.navy }}>
            {pregunta.texto}
          </h2>

          <div className="space-y-3">
            {pregunta.opciones.map((op, i) => {
              const elegida = seleccionada === i;
              const deshabilitada = seleccionada !== null && !elegida;
              return (
                <button
                  key={i}
                  onClick={() => elegirOpcion(op.puntos, i)}
                  disabled={seleccionada !== null}
                  className="w-full flex items-center justify-between gap-3 text-left px-5 py-4 rounded-2xl border-[3px] transition-all duration-200"
                  style={{
                    background: elegida ? cuestionario.color : "white",
                    borderColor: elegida ? cuestionario.color : "rgba(18,38,58,0.08)",
                    color: elegida ? "white" : C.navy,
                    opacity: deshabilitada ? 0.45 : 1,
                    transform: elegida ? "scale(1.02)" : "scale(1)",
                    boxShadow: elegida ? `0 8px 0 ${cuestionario.color}55` : "0 4px 0 rgba(18,38,58,0.05)",
                  }}
                >
                  <span className="text-[13.5px] font-semibold leading-snug">{op.texto}</span>
                  {elegida && (
                    <CheckCircle2 size={19} className="flex-shrink-0" style={{ animation: "popCheck .35s ease-out both" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pb-8 flex items-center gap-1.5" style={{ opacity: 0.55 }}>
        <Beto size={30} mood="wave" />
        <span className="text-[11px] font-semibold" style={{ color: C.slate }}>Tómate tu tiempo, no hay respuestas incorrectas</span>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// RESULTADO — perfil, fortalezas, recomendaciones, etc.
// ════════════════════════════════════════════════════════════

type ResultadoProps = {
  cuestionario: Cuestionario;
  puntaje: number;
  onVolver: () => void;
  onRepetir: () => void;
};

function PantallaResultado({ cuestionario, puntaje, onVolver, onRepetir }: ResultadoProps) {
  const [mostrarConfeti, setMostrarConfeti] = useState(true);
  const nivel: NivelResultado = obtenerNivel(cuestionario, puntaje);
  const maximo = puntajeMaximo(cuestionario);
  const porcentaje = Math.round((puntaje / maximo) * 100);

  useEffect(() => {
    const t = setTimeout(() => setMostrarConfeti(false), 2400);
    return () => clearTimeout(t);
  }, []);

  const secciones: { titulo: string; Icon: typeof Lightbulb; items: string[]; color: string }[] = [
    { titulo: "Tus fortalezas", Icon: Trophy, items: nivel.fortalezas, color: C.moss },
    { titulo: "Áreas de mejora", Icon: Compass, items: nivel.areasMejora, color: C.mandarin },
    { titulo: "Recomendaciones", Icon: Lightbulb, items: nivel.recomendaciones, color: C.blue },
    { titulo: "Hábitos sugeridos", Icon: ListChecks, items: nivel.habitosSugeridos, color: C.turquoise },
    { titulo: "Próximos pasos", Icon: TrendingUp, items: nivel.proximosPasos, color: C.mossDeep },
    { titulo: "Recursos relacionados", Icon: BookMarked, items: nivel.recursos, color: C.navySoft },
  ];

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popIn { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }
        @keyframes confetiCaida { 0% { transform: translateY(-20px) rotate(0deg); opacity:1; } 100% { transform: translateY(420px) rotate(540deg); opacity:0; } }
      `}</style>

      {mostrarConfeti && <Confeti color={cuestionario.color} />}

      <div className="relative overflow-hidden" style={{ background: C.navy }}>
        <PatternDots color="#FFFFFF" opacity={0.05} size={20} />
        <div className="relative px-8 pt-10 pb-16 max-w-3xl mx-auto text-center" style={{ animation: "popIn .4s ease-out both" }}>
          <button onClick={onVolver} className="absolute left-6 top-6 flex items-center gap-1.5 text-[12px] font-bold text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={15} /> Cuestionarios
          </button>
          <div className="text-[52px] mb-2 leading-none">{nivel.emoji}</div>
          <p className="text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: "#9FB4C4" }}>Tu resultado en «{cuestionario.titulo}»</p>
          <h1 className="font-['Space_Grotesk'] font-extrabold text-[28px] text-white mb-3">{nivel.perfil}</h1>
          <p className="text-[13.5px] max-w-lg mx-auto leading-relaxed" style={{ color: "#C7D4DE" }}>{nivel.descripcion}</p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <RingProgress value={porcentaje} color={C.sun} track="rgba(255,255,255,0.14)" size={72} stroke={7}>
              <span className="font-['Space_Grotesk'] font-extrabold text-[15px] text-white">{porcentaje}%</span>
            </RingProgress>
            <div className="text-left">
              <div className="text-[12px] font-bold text-white">{puntaje} de {maximo} puntos</div>
              <div className="text-[11px]" style={{ color: "#9FB4C4" }}>Reflexión completada</div>
            </div>
          </div>
        </div>
        <Ola fill={C.cream} />
      </div>

      <div className="px-8 pb-14 max-w-5xl mx-auto -mt-2">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {secciones.map((s, i) => (
            <div
              key={s.titulo}
              className="rounded-[24px] bg-white border-[3px] p-5"
              style={{ borderColor: "rgba(18,38,58,0.08)", animation: `fadeInUp .4s ease-out ${i * 0.06}s both` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}1E` }}>
                  <s.Icon size={15} color={s.color} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-[13.5px]" style={{ color: C.navy }}>{s.titulo}</h3>
              </div>
              <ul className="space-y-2">
                {s.items.map((item, idx) => (
                  <li key={idx} className="text-[12.5px] leading-relaxed flex items-start gap-2" style={{ color: C.slate }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onRepetir}
            className="flex items-center gap-2 text-[13px] font-bold px-5 py-3 rounded-full border-2 transition-all hover:-translate-y-0.5"
            style={{ borderColor: C.navy, color: C.navy }}
          >
            <RotateCcw size={15} /> Repetir cuestionario
          </button>
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-[13px] font-bold px-5 py-3 rounded-full text-white transition-all hover:-translate-y-0.5"
            style={{ background: cuestionario.color, boxShadow: `0 4px 0 ${cuestionario.color}88` }}
          >
            Ver más cuestionarios <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// Confeti — pequeña celebración visual al terminar
// ════════════════════════════════════════════════════════════

function Confeti({ color }: { color: string }) {
  const piezas = useMemo(() => {
    const colores = [color, C.sun, C.moss, C.turquoise, C.mandarin];
    return Array.from({ length: 24 }).map((_, i) => ({
      izquierda: Math.random() * 100,
      retraso: Math.random() * 0.5,
      duracion: 1.6 + Math.random() * 0.9,
      color: colores[i % colores.length],
      tamano: 6 + Math.random() * 6,
      rotar: Math.random() > 0.5,
    }));
  }, [color]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {piezas.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.izquierda}%`,
            top: -20,
            width: p.tamano,
            height: p.tamano * (p.rotar ? 1.6 : 1),
            background: p.color,
            borderRadius: p.rotar ? 2 : "50%",
            animation: `confetiCaida ${p.duracion}s ease-in ${p.retraso}s both`,
          }}
        />
      ))}
    </div>
  );
}