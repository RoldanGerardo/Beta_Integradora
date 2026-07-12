import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  TrendingUp, TrendingDown, GraduationCap, Briefcase, Gift, Tag,
  Utensils, Bus, School, Ticket, Shirt, Check, Trash2, Loader2, AlertCircle,
  Wallet, Mail, HelpCircle, Sparkles,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { Movimiento } from "../models/Movimiento";
import { obtenerMovimientos, crearMovimiento, eliminarMovimiento } from "../services/api";
import { C } from "./theme.ts";

interface MovimientosProps {
  tipoVista: "ingresos" | "egresos" | "balance";
  onNavigate?: (vista: string) => void;
}

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

function useCountUp(valor: number, duracion = 500) {
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
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(inicio + delta * ease);
      if (p < 1) frame = requestAnimationFrame(tick);
      else anterior.current = valor;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [valor, duracion]);

  return display;
}

export default function MovimientosManager({ tipoVista, onNavigate }: MovimientosProps) {
  const isIngreso = tipoVista === "ingresos";
  const tema = isIngreso
    ? { bg: "#E4F7E1", border: C.moss, text: "#3D7A41", chip: "rgba(132,209,117,0.25)" }
    : { bg: "#FDECDD", border: C.mandarin, text: "#AE6D21", chip: "rgba(248,145,12,0.18)" };

  const categorias = isIngreso
    ? ["Becas", "Mesada", "Trabajo", "Regalos", "Ventas"]
    : ["Comida", "Transporte", "Escuela", "Salidas", "Ropa"];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    if (tipoVista === "balance") return;

    let activo = true;
    setCategoriaSeleccionada(categorias[0]);
    setCargando(true);
    setError(null);

    obtenerMovimientos(isIngreso ? "ingreso" : "egreso")
      .then((data) => {
        if (activo) setHistorial(data);
      })
      .catch(() => {
        if (activo) setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [tipoVista]);

  const saldoTotal = useMemo(
    () => historial.reduce((acc, m) => acc + Number(m.monto), 0),
    [historial]
  );
  const saldoAnimado = useCountUp(saldoTotal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !monto || !fecha) return;

    const datos: Omit<Movimiento, "id"> = {
      monto: Number(monto),
      descripcion: nombre,
      fecha,
      tipo: isIngreso ? "ingreso" : "egreso",
      categoria: categoriaSeleccionada,
    };

    const idTemporal = Date.now();
    setHistorial((prev) => [{ ...datos, id: idTemporal }, ...prev]);
    setNombre("");
    setMonto("");
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1600);

    try {
      const guardadoReal = await crearMovimiento(datos);
      setHistorial((prev) => prev.map((m) => (m.id === idTemporal ? guardadoReal : m)));
    } catch {
      setHistorial((prev) => prev.filter((m) => m.id !== idTemporal));
      setError("No se pudo guardar el movimiento. Intenta de nuevo.");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id === undefined) return;
    const respaldo = historial;
    setEliminandoId(id);
    setHistorial((prev) => prev.filter((m) => m.id !== id));

    try {
      await eliminarMovimiento(id);
    } catch {
      setHistorial(respaldo); // revertir si falla
      setError("No se pudo eliminar el movimiento.");
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col" style={{ background: C.cream, fontFamily: "'Space Grotesk',sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity:0; transform: scale(.9); } 100% { opacity:1; transform: scale(1); } }
        @keyframes bounceSoft { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes checkPop { 0% { transform: scale(.6); opacity:0; } 60% { transform: scale(1.15); opacity:1; } 100% { transform: scale(1); opacity:1; } }
        @keyframes slideOut { to { opacity:0; transform: translateX(20px); max-height:0; padding:0; margin:0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .gummy4 { box-shadow: 0 5px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy4:hover { transform: translateY(-2px); box-shadow: 0 7px 0 var(--g,#12263A); }
        .gummy4:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--g,#12263A); }
      `}</style>

      <header className="flex items-center justify-between px-8 py-4 flex-shrink-0" style={{ background: "white", borderBottom: "2px solid rgba(18,38,58,0.06)" }}>
        <div className="px-5 py-1.5 rounded-full text-[13px] font-extrabold flex items-center gap-2 border-2" style={{ background: tema.bg, color: C.navy, borderColor: tema.border }}>
          {isIngreso ? <TrendingUp size={14} color={tema.text} /> : <TrendingDown size={14} color={tema.text} />} Tus {tipoVista}
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95" style={{ background: "rgba(250,190,11,0.14)" }} title="Notificaciones">
            <span className="text-[16px]">🔔</span>
          </button>
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white text-sm" style={{ background: C.blue }}>U</div>
        </div>
      </header>

      <div className="flex-1 px-8 py-6 flex flex-col gap-5 overflow-y-auto max-w-6xl w-full mx-auto">
        {error && (
          <div className="rounded-2xl p-3 flex items-center gap-2 text-[12px] font-semibold border-2" style={{ background: "#FEE2E2", color: "#B91C1C", borderColor: "#F87171", animation: "fadeInUp .3s ease-out" }}>
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError(null)} className="ml-auto font-bold hover:opacity-70 transition-opacity">✕</button>
          </div>
        )}

        <div className="rounded-[28px] p-6 flex items-center gap-5 relative overflow-hidden border-[3px] transition-shadow duration-300 hover:shadow-md" style={{ background: tema.bg, borderColor: tema.border }}>
          <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center z-10 border-2 transition-transform duration-300 hover:rotate-6" style={{ background: "white", borderColor: tema.border }}>
            {isIngreso ? <TrendingUp size={26} color={tema.text} /> : <TrendingDown size={26} color={tema.text} />}
          </div>
          <div className="flex-1 z-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: tema.text }}>{isIngreso ? "Ingresos totales" : "Total de egresos"}</div>
            <div className="text-[28px] font-extrabold tabular-nums" style={{ color: C.navy }}>
              {cargando ? <Loader2 size={22} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> : `$${saldoAnimado.toFixed(2)}`}
            </div>
            <div className="text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>{historial.length} {historial.length === 1 ? "movimiento registrado" : "movimientos registrados"}</div>
          </div>
          <div className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full pointer-events-none" style={{ background: tema.border, opacity: 0.12 }} />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: C.slate }}>Categorías</p>
          <div className="flex gap-3 overflow-x-auto py-1 px-1">
            {categorias.map((cat, i) => {
              const Icono = categoriaIconos[cat] ?? Tag;
              const activo = categoriaSeleccionada === cat;
              return (
                <button key={cat} type="button" onClick={() => setCategoriaSeleccionada(cat)} className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-transform duration-200" style={{ transform: activo ? "scale(1.08)" : "scale(1)", animation: `fadeInUp .35s ease-out ${i * 0.04}s both` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 hover:-translate-y-0.5" style={{ background: activo ? C.blue : "white", borderColor: activo ? C.navy : tema.border, boxShadow: activo ? "0 4px 0 #12263A" : "none" }}>
                    <Icono size={20} color={activo ? "white" : tema.text} />
                  </div>
                  <span className="text-[11px] font-bold transition-colors duration-200" style={{ color: activo ? C.blue : C.slate }}>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-[28px] p-6 border-[3px] transition-shadow duration-300 hover:shadow-md" style={{ borderColor: "rgba(18,38,58,0.1)" }}>
            <h3 className="font-extrabold text-[15px] mb-5" style={{ color: C.navy }}>Nuevo {isIngreso ? "ingreso" : "egreso"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: C.slate }}>Nombre</label>
                <input
                  type="text"
                  placeholder={isIngreso ? "Ej. Mesada de junio" : "Ej. Cine con amigos"}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-all duration-200"
                  style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = tema.border)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: C.slate }}>Monto</label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-all duration-200"
                    style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = tema.border)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: C.slate }}>Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-all duration-200"
                    style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = tema.border)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors duration-200" style={{ background: tema.chip }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: tema.text }}>Categoría:</span>
                <span className="text-[12px] font-bold" style={{ color: C.navy }}>{categoriaSeleccionada}</span>
              </div>
              <div className="flex justify-end items-center gap-2 pt-2">
                {guardado && (
                  <span className="flex items-center gap-1 text-[11px] font-bold mr-auto" style={{ color: tema.text, animation: "checkPop .35s ease-out" }}>
                    <Check size={14} /> ¡Guardado! <Sparkles size={12} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => { setNombre(""); setMonto(""); }}
                  className="px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-95 active:scale-95"
                  style={{ background: C.cream, color: C.navy }}
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  className="gummy4 px-5 py-2 rounded-full text-[12px] font-extrabold border-2"
                  style={{ background: C.sun, color: C.navy, borderColor: C.navy, "--g": C.navy } as React.CSSProperties}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-[28px] p-6 border-[3px] transition-shadow duration-300 hover:shadow-md" style={{ borderColor: "rgba(18,38,58,0.1)" }}>
            <h3 className="font-extrabold text-[15px] mb-5" style={{ color: C.navy }}>Historial de {tipoVista}</h3>
            <div className="space-y-2.5 h-64 overflow-y-auto pr-1">
              {cargando ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                  <Loader2 size={24} style={{ color: tema.border, animation: "spin 1s linear infinite" }} />
                  <p className="text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Cargando movimientos...</p>
                </div>
              ) : historial.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                  <Wallet size={28} style={{ color: "#DCEBFB", animation: "bounceSoft 2.4s ease-in-out infinite" }} />
                  <p className="text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Aún no hay {tipoVista} registrados.</p>
                </div>
              ) : (
                historial.map((item, idx) => {
                  const Icono = categoriaIconos[item.categoria] ?? Tag;
                  const seEstaEliminando = eliminandoId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="group p-3 rounded-2xl flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm border-2"
                      style={{ background: tema.bg, borderColor: `${tema.border}55`, animation: seEstaEliminando ? "slideOut .25s ease-in forwards" : `popIn .3s ease-out ${idx === 0 ? 0 : 0.02}s both` }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}>
                          <Icono size={16} color={tema.text} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold truncate" style={{ color: C.navy }}>{item.descripcion}</p>
                          <p className="text-[10px]" style={{ color: C.slate }}>{item.categoria} · {item.fecha}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="font-bold text-[14px] tabular-nums" style={{ color: tema.text }}>
                          {isIngreso ? "+" : "-"}${Number(item.monto).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleEliminar(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-white active:scale-90"
                          style={{ color: "#B91C1C" }}
                          title="Eliminar movimiento"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] p-5 flex items-center gap-3 relative overflow-hidden border-[3px] transition-shadow duration-300 hover:shadow-md" style={{ background: tema.bg, borderColor: tema.border }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0" style={{ background: "white" }}>💡</div>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: C.navy, fontFamily: "'Inter',sans-serif" }}>
            {isIngreso
              ? "Separa un porcentaje de cada ingreso apenas lo recibas: tu yo futuro te lo va a agradecer."
              : "Antes de gastar, pregúntate si lo necesitas hoy o si puede esperar hasta la próxima quincena."}
          </p>
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
        <button onClick={() => onNavigate && onNavigate("contacto")} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95" style={{ border: `2px solid ${C.navy}20`, color: C.slate }} title="Ayuda y Soporte">
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}