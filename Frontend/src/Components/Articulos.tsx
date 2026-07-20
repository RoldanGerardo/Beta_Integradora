import { useEffect, useMemo, useState } from "react";
import type { UIEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search, Clock, Calendar, ArrowLeft, ArrowRight, Bookmark, BookmarkCheck,
  Share2, Sparkles, PiggyBank, Wallet, TrendingUp, CreditCard, GraduationCap,
  Rocket, Target, AlertTriangle, X, AlertCircle, BookOpen, Flame,
} from "lucide-react";
import { Beto, PatternDots } from "./Ilustraciones.tsx";
import { C } from "./theme.ts";
import { Articulo } from "../models/Articulo";
import { obtenerArticulos } from "../services/educativoApi.ts";

type Props = {
  onNavigate?: (vista: string) => void;
};

type CategoriaInfo = { color: string; Icon: LucideIcon };

const CATEGORIAS: Record<string, CategoriaInfo> = {
  "Ahorro": { color: C.moss, Icon: PiggyBank },
  "Presupuesto": { color: C.blue, Icon: Wallet },
  "Inversión": { color: C.turquoise, Icon: TrendingUp },
  "Tarjetas de crédito": { color: C.mandarin, Icon: CreditCard },
  "Educación financiera": { color: "#AE6D21", Icon: GraduationCap },
  "Emprendimiento": { color: C.navySoft, Icon: Rocket },
  "Metas financieras": { color: "#0E7490", Icon: Target },
  "Errores comunes": { color: "#B91C1C", Icon: AlertTriangle },
};

const CATEGORIA_DEFAULT: CategoriaInfo = { color: C.slate, Icon: BookOpen };

function infoCategoria(categoria?: string): CategoriaInfo {
  if (!categoria) return CATEGORIA_DEFAULT;
  return CATEGORIAS[categoria] ?? CATEGORIA_DEFAULT;
}

function formatFecha(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length !== 3) return fecha;
  const [dia, mes, anio] = partes;
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const idx = Number(mes) - 1;
  if (idx < 0 || idx > 11) return fecha;
  return `${Number(dia)} ${meses[idx]} ${anio}`;
}

const LLAVE_GUARDADOS = "beta_articulos_guardados";

function cargarGuardados(): number[] {
  try {
    const raw = localStorage.getItem(LLAVE_GUARDADOS);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function SkeletonTarjeta() {
  return (
    <div className="rounded-[28px] overflow-hidden border-[3px]" style={{ borderColor: "rgba(18,38,58,0.08)" }}>
      <div className="h-36 w-full animate-pulse" style={{ background: "rgba(18,38,58,0.08)" }} />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 rounded-full animate-pulse" style={{ background: "rgba(18,38,58,0.08)" }} />
        <div className="h-4 w-full rounded-full animate-pulse" style={{ background: "rgba(18,38,58,0.1)" }} />
        <div className="h-3 w-3/4 rounded-full animate-pulse" style={{ background: "rgba(18,38,58,0.08)" }} />
      </div>
    </div>
  );
}

function Portada({ categoria, destacado = false, imagen }: { categoria?: string; destacado?: boolean; imagen?: string }) {
  const { color, Icon } = infoCategoria(categoria);
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        height: destacado ? 220 : 136,
        background: imagen
          ? `linear-gradient(135deg, ${color}35, ${color}0A), url(${imagen}) center / cover no-repeat`
          : `linear-gradient(135deg, ${color}35, ${color}0A)`,
      }}
    >
      {!imagen && <PatternDots color={color} opacity={0.16} size={destacado ? 18 : 14} />}
      {!imagen && (
        <div
          className="absolute -right-6 -top-6 rounded-full pointer-events-none"
          style={{ width: destacado ? 140 : 90, height: destacado ? 140 : 90, background: color, opacity: 0.12 }}
        />
      )}
      {!imagen && (
        <div
          className="rounded-full flex items-center justify-center border-2 relative z-10"
          style={{ width: destacado ? 76 : 52, height: destacado ? 76 : 52, background: "white", borderColor: color, boxShadow: `0 4px 0 ${color}40` }}
        >
          <Icon size={destacado ? 34 : 24} color={color} strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
}

function TarjetaArticulo({
  articulo, onAbrir, guardado, onGuardar,
}: {
  articulo: Articulo;
  onAbrir: () => void;
  guardado: boolean;
  onGuardar: () => void;
}) {
  const { color } = infoCategoria(articulo.categoria);
  return (
    <div
      className="group rounded-[28px] overflow-hidden bg-white border-[3px] cursor-pointer transition-all duration-200 hover:-translate-y-1.5 flex flex-col h-full"
      style={{ borderColor: "rgba(18,38,58,0.08)", boxShadow: "0 10px 22px -14px rgba(15,33,56,0.25)" }}
      onClick={onAbrir}
    >
      <div className="relative">
        <Portada categoria={articulo.categoria} imagen={articulo.imagen} />
        <button
          onClick={(e) => { e.stopPropagation(); onGuardar(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-95 z-10"
          style={{ background: "white", boxShadow: "0 2px 6px rgba(15,33,56,0.25)" }}
          title={guardado ? "Quitar de guardados" : "Guardar para después"}
        >
          {guardado ? <BookmarkCheck size={15} color={color} /> : <Bookmark size={15} color={C.slate} />}
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="self-start text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: `${color}1E`, color }}>
          {articulo.categoria ?? "Educación financiera"}
        </span>
        <h3 className="font-['Space_Grotesk'] font-extrabold text-[15px] leading-snug" style={{ color: C.navy }}>
          {articulo.titulo}
        </h3>
        <p className="beta-clamp-2 text-[12.5px] leading-relaxed" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>
          {articulo.resumen ?? articulo.contenido.slice(0, 110) + "…"}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid rgba(18,38,58,0.06)" }}>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: C.slate }}>
            <Calendar size={12} /> {formatFecha(articulo.fecha)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color }}>
            <Clock size={12} /> {articulo.tiempoLectura ?? 4} min
          </div>
        </div>
      </div>
    </div>
  );
}

function VistaDetalle({
  articulo, relacionados, guardado, onGuardar, onCompartir, onVolver, onAbrir, progreso, onScroll, copiado,
}: {
  articulo: Articulo;
  relacionados: Articulo[];
  guardado: boolean;
  onGuardar: () => void;
  onCompartir: () => void;
  onVolver: () => void;
  onAbrir: (a: Articulo) => void;
  progreso: number;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
  copiado: boolean;
}) {
  const { color, Icon } = infoCategoria(articulo.categoria);
  const parrafos = articulo.contenido.split("\\n\\n").filter(Boolean);

  return (
    <div className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream }} onScroll={onScroll}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
      `}</style>

      <div className="sticky top-0 z-20 h-1" style={{ background: "rgba(18,38,58,0.06)" }}>
        <div className="h-full transition-[width] duration-150" style={{ width: `${progreso}%`, background: `linear-gradient(90deg, ${color}, ${C.blue})` }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-8">
        <button onClick={onVolver} className="flex items-center gap-1.5 text-[12px] font-bold mb-6 transition-opacity hover:opacity-70" style={{ color: C.slate }}>
          <ArrowLeft size={15} /> Volver a Artículos
        </button>

        <div className="rounded-[32px] overflow-hidden border-[3px] mb-7" style={{ borderColor: "rgba(18,38,58,0.08)", animation: "fadeInUp .4s ease-out both" }}>
          <Portada categoria={articulo.categoria} destacado imagen={articulo.imagen} />
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-3" style={{ background: `${color}1E`, color }}>
          <Icon size={12} /> {articulo.categoria ?? "Educación financiera"}
        </span>

        <h1 className="font-['Space_Grotesk'] font-extrabold text-[26px] md:text-[30px] leading-tight mb-4" style={{ color: C.navy }}>
          {articulo.titulo}
        </h1>

        <div className="flex flex-wrap items-center gap-4 pb-5 mb-6" style={{ borderBottom: "2px solid rgba(18,38,58,0.08)" }}>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[12px] flex-shrink-0" style={{ background: color }}>
              {(articulo.autor ?? "BETA").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <div className="text-[12.5px] font-bold" style={{ color: C.navy }}>{articulo.autor ?? "Equipo BETA"}</div>
              <div className="flex items-center gap-2 text-[11px]" style={{ color: C.slate }}>
                <span className="flex items-center gap-1"><Calendar size={11} /> {formatFecha(articulo.fecha)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {articulo.tiempoLectura ?? 4} min de lectura</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onGuardar}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: guardado ? `${color}22` : "rgba(18,38,58,0.05)", color: guardado ? color : C.slate }}
            >
              {guardado ? <BookmarkCheck size={14} /> : <Bookmark size={14} />} {guardado ? "Guardado" : "Guardar"}
            </button>
            <button
              onClick={onCompartir}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ background: "rgba(18,38,58,0.05)", color: C.slate }}
            >
              <Share2 size={14} /> {copiado ? "¡Copiado!" : "Compartir"}
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {parrafos.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.85]"
              style={{ color: C.navy, fontFamily: "'Inter',sans-serif", animation: `fadeInUp .4s ease-out ${i * 0.04}s both` }}
            >
              {p}
            </p>
          ))}
        </div>

        {articulo.tags && articulo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {articulo.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(18,38,58,0.05)", color: C.slate }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="rounded-[24px] p-5 flex items-center gap-3 mb-10" style={{ background: "#DCEBFB", border: `2px solid ${C.blue}30` }}>
          <Sparkles size={20} color={C.blue} />
          <p className="text-[12.5px] font-semibold leading-relaxed" style={{ color: C.navy, fontFamily: "'Inter',sans-serif" }}>
            ¿Te sirvió este artículo? Guárdalo y compártelo con alguien que esté empezando su camino financiero.
          </p>
        </div>

        {relacionados.length > 0 && (
          <div>
            <h3 className="font-['Space_Grotesk'] font-extrabold text-[16px] mb-4" style={{ color: C.navy }}>Sigue leyendo</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {relacionados.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onAbrir(r)}
                  className="rounded-2xl overflow-hidden bg-white border-[3px] cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                  style={{ borderColor: "rgba(18,38,58,0.08)" }}
                >
                  <Portada categoria={r.categoria} imagen={r.imagen} />
                  <div className="p-3">
                    <h4 className="beta-clamp-2 font-bold text-[12.5px] leading-snug" style={{ color: C.navy }}>{r.titulo}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Articulos({ onNavigate }: Props) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todas");
  const [seleccionado, setSeleccionado] = useState<Articulo | null>(null);
  const [guardados, setGuardados] = useState<number[]>([]);
  const [progreso, setProgreso] = useState(0);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setGuardados(cargarGuardados());
  }, []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);
    obtenerArticulos()
      .then((data) => { if (activo) setArticulos(data); })
      .catch(() => { if (activo) setError("No se pudieron cargar los artículos. Intenta de nuevo más tarde."); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const categorias = useMemo(() => {
    const set = new Set<string>();
    articulos.forEach((a) => { if (a.categoria) set.add(a.categoria); });
    return ["Todas", ...Array.from(set)];
  }, [articulos]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return articulos.filter((a) => {
      const coincideCategoria = categoriaActiva === "Todas" || a.categoria === categoriaActiva;
      const coincideBusqueda =
        !q ||
        a.titulo.toLowerCase().includes(q) ||
        (a.resumen ?? "").toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return coincideCategoria && coincideBusqueda;
    });
  }, [articulos, categoriaActiva, busqueda]);

  const destacado = useMemo(() => articulos.find((a) => a.destacado) ?? articulos[0], [articulos]);
  const tendencias = useMemo(
    () => articulos.filter((a) => a.id !== destacado?.id).slice(0, 4),
    [articulos, destacado]
  );

  function toggleGuardado(id?: number) {
    if (id === undefined) return;
    setGuardados((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(LLAVE_GUARDADOS, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }

  function abrirArticulo(a: Articulo) {
    setSeleccionado(a);
    setProgreso(0);
  }

  function compartir(a: Articulo) {
    const texto = `${a.titulo} — BETA: Finanzas para los Jóvenes`;
    const nav = navigator as Navigator & { share?: (data: { title: string; text: string }) => Promise<void> };
    if (nav.share) {
      nav.share({ title: a.titulo, text: texto }).catch(() => { /* cancelado por el usuario */ });
    } else {
      navigator.clipboard?.writeText(texto).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }).catch(() => { /* noop */ });
    }
  }

  function manejarScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgreso(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  }

  if (seleccionado) {
    const mismaCategoria = articulos.filter((a) => a.id !== seleccionado.id && a.categoria === seleccionado.categoria);
    const relacionados = (mismaCategoria.length > 0 ? mismaCategoria : articulos.filter((a) => a.id !== seleccionado.id)).slice(0, 3);
    return (
      <VistaDetalle
        key={seleccionado.id}
        articulo={seleccionado}
        relacionados={relacionados}
        guardado={guardados.includes(seleccionado.id ?? -1)}
        onGuardar={() => toggleGuardado(seleccionado.id)}
        onCompartir={() => compartir(seleccionado)}
        onVolver={() => setSeleccionado(null)}
        onAbrir={(a) => abrirArticulo(a)}
        progreso={progreso}
        onScroll={manejarScroll}
        copiado={copiado}
      />
    );
  }

  const mostrarDestacados = categoriaActiva === "Todas" && !busqueda;

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popIn { from { opacity:0; transform: scale(.94); } to { opacity:1; transform: scale(1); } }
        .beta-articulos-scroll::-webkit-scrollbar { height: 6px; }
        .beta-articulos-scroll::-webkit-scrollbar-thumb { background: rgba(18,38,58,0.15); border-radius: 999px; }
        .beta-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div className="px-8 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Beto size={54} mood="cheer" />
          <div>
            <h1 className="font-['Space_Grotesk'] font-extrabold text-[24px]" style={{ color: C.navy }}>Artículos</h1>
            <p className="text-[13px]" style={{ color: C.slate }}>Ideas cortas y claras para mejorar tu relación con el dinero</p>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-7xl mx-auto sticky top-0 z-20 pb-4" style={{ background: C.cream }}>
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border-[3px] mb-4" style={{ borderColor: "rgba(18,38,58,0.08)" }}>
          <Search size={16} color={C.slate} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Busca por tema, palabra clave o etiqueta…"
            className="flex-1 text-[13px] outline-none bg-transparent"
            style={{ color: C.navy }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5">
              <X size={13} color={C.slate} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 beta-articulos-scroll">
          {categorias.map((cat) => {
            const activo = categoriaActiva === cat;
            const { color, Icon } = cat === "Todas" ? { color: C.navy, Icon: Sparkles } : infoCategoria(cat);
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="flex items-center gap-1.5 flex-shrink-0 text-[12px] font-bold px-3.5 py-2 rounded-full border-2 transition-all duration-150"
                style={{ background: activo ? color : "white", color: activo ? "white" : color, borderColor: color }}
              >
                <Icon size={13} /> {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">
        {error && (
          <div className="rounded-2xl p-4 mb-6 flex items-center gap-2 text-[13px] font-semibold" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {cargando ? (
          <div className="grid md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonTarjeta key={i} />)}
          </div>
        ) : articulos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <Beto size={110} mood="wave" />
            <p className="font-bold text-[15px] mt-4" style={{ color: C.navy }}>Todavía no hay artículos publicados</p>
            <p className="text-[12.5px] mt-1" style={{ color: C.slate }}>Vuelve pronto, estamos preparando contenido nuevo.</p>
          </div>
        ) : (
          <>
            {mostrarDestacados && (
              <div className="flex items-center justify-between gap-3 rounded-2xl p-4 mb-6 border-2" style={{ background: C.creamDeep, borderColor: C.sun }}>
                <div className="flex items-center gap-3">
                  <Sparkles size={18} color="#8A5B00" />
                  <p className="text-[12.5px] font-semibold" style={{ color: C.navy }}>
                    ¿Ya pusiste a prueba lo que aprendiste? Tenemos cuestionarios cortos para reforzarlo.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.("cuestionarios")}
                  className="flex-shrink-0 text-[11.5px] font-bold px-3.5 py-2 rounded-full text-white transition-transform hover:scale-105 active:scale-95"
                  style={{ background: C.navy }}
                >
                  Ir a cuestionarios
                </button>
              </div>
            )}

            {destacado && mostrarDestacados && (
              <div className="mb-8" style={{ animation: "fadeInUp .4s ease-out both" }}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Flame size={14} color={C.mandarin} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.mandarin }}>Destacado</span>
                </div>
                <div
                  onClick={() => abrirArticulo(destacado)}
                  className="group grid md:grid-cols-2 rounded-[32px] overflow-hidden bg-white border-[3px] cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  style={{ borderColor: "rgba(18,38,58,0.08)", boxShadow: "0 14px 30px -18px rgba(15,33,56,0.3)" }}
                >
                  <Portada categoria={destacado.categoria} destacado imagen={destacado.imagen} />
                  <div className="p-6 flex flex-col justify-center gap-3">
                    <span
                      className="self-start text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                      style={{ background: `${infoCategoria(destacado.categoria).color}1E`, color: infoCategoria(destacado.categoria).color }}
                    >
                      {destacado.categoria ?? "Educación financiera"}
                    </span>
                    <h2 className="font-['Space_Grotesk'] font-extrabold text-[20px] leading-snug" style={{ color: C.navy }}>{destacado.titulo}</h2>
                    <p className="text-[13px] leading-relaxed" style={{ color: C.slate }}>{destacado.resumen ?? destacado.contenido.slice(0, 160) + "…"}</p>
                    <div className="flex items-center gap-4 text-[11.5px] font-semibold mt-1" style={{ color: C.slate }}>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatFecha(destacado.fecha)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {destacado.tiempoLectura ?? 4} min</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-bold mt-2 transition-transform duration-200 group-hover:translate-x-1" style={{ color: C.blue }}>
                      Leer artículo <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {tendencias.length > 0 && mostrarDestacados && (
              <div className="mb-8">
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp size={14} color={C.turquoise} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.turquoise }}>Tendencias esta semana</span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 beta-articulos-scroll">
                  {tendencias.map((a) => (
                    <div key={a.id} className="flex-shrink-0" style={{ width: 240 }}>
                      <TarjetaArticulo
                        articulo={a}
                        onAbrir={() => abrirArticulo(a)}
                        guardado={guardados.includes(a.id ?? -1)}
                        onGuardar={() => toggleGuardado(a.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-3">
              <BookOpen size={14} color={C.navy} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.navy }}>
                {busqueda || categoriaActiva !== "Todas" ? `${filtrados.length} resultado${filtrados.length === 1 ? "" : "s"}` : "Todos los artículos"}
              </span>
            </div>

            {filtrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <Beto size={100} mood="wave" />
                <p className="font-bold text-[14px] mt-4" style={{ color: C.navy }}>No encontramos artículos con esa búsqueda</p>
                <p className="text-[12.5px] mt-1" style={{ color: C.slate }}>Prueba con otra palabra clave o revisa otra categoría.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtrados.map((a, i) => (
                  <div key={a.id} style={{ animation: `popIn .35s ease-out ${Math.min(i, 8) * 0.04}s both` }}>
                    <TarjetaArticulo
                      articulo={a}
                      onAbrir={() => abrirArticulo(a)}
                      guardado={guardados.includes(a.id ?? -1)}
                      onGuardar={() => toggleGuardado(a.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}