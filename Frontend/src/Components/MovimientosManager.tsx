/* ─────────────────────────────────────────────────
   src/Components/MovimientosManager.tsx
   ───────────────────────────────────────────────── */
import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Wallet, Mail, HelpCircle,
  TrendingUp, TrendingDown, GraduationCap, Briefcase, Gift, Tag,
  Utensils, Bus, School, Ticket, Shirt,
} from "lucide-react";
import BetaLogo from "./BetaLogo";

interface MovimientosProps {
  tipoVista: "ingresos" | "egresos" | "balance";
  onNavigate?: (vista: string) => void;
}

/* Ícono por categoría — reemplaza el placeholder "?" del carrusel */
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

export default function MovimientosManager({ tipoVista, onNavigate }: MovimientosProps) {
  const isIngreso = tipoVista === "ingresos";

  // Paleta según tipo — misma que usa Dashboard.tsx en movCards,
  // así "Ingresos" y "Egresos" se sienten parte de la misma app.
  const tema = isIngreso
    ? { bg: "#E6FBDA", border: "#84D175", text: "#707D4E", chip: "rgba(132,209,117,0.20)" }
    : { bg: "#FFF3E0", border: "#F8910C", text: "#AE6D21", chip: "rgba(248,145,12,0.15)" };

  const categorias = isIngreso
    ? ["Becas", "Mesada", "Trabajo", "Regalos", "Ventas"]
    : ["Comida", "Transporte", "Escuela", "Salidas", "Ropa"];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const cargarMovimientos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/movimientos");
      if (response.ok) {
        const data = await response.json();
        const dataFiltrada = data.filter((mov: any) =>
          isIngreso ? mov.detalle.includes("Ingreso") : mov.detalle.includes("Egreso")
        );
        setHistorial(dataFiltrada);
        const total = dataFiltrada.reduce((acc: number, curr: any) => acc + Number(curr.monto), 0);
        setSaldoTotal(total);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  useEffect(() => {
    setCategoriaSeleccionada(categorias[0]);
    cargarMovimientos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoVista]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !monto || !fecha) return;

    const nuevoRegistro = {
      monto: Number(monto),
      descripcion: nombre,
      fecha,
      tipo: categoriaSeleccionada,
      categoria: isIngreso ? "ingreso" : "egreso",
    };

    try {
      const response = await fetch("http://localhost:5000/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRegistro),
      });
      if (response.ok) {
        setNombre("");
        setMonto("");
        cargarMovimientos();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (tipoVista === "balance") {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center" style={{ background: "#FFFACB" }}>
        <div className="text-center">
          <span className="text-4xl">🚧</span>
          <h2 className="text-xl font-bold mt-3" style={{ color: "#12263A", fontFamily: "'Space Grotesk',sans-serif" }}>
            Vista de Balance Global en construcción
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
      {/* ── TOP BAR (mismo patrón que Dashboard.tsx) ── */}
      <header
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ background: "#F4EDEA", borderBottom: "1px solid rgba(18,38,58,0.07)" }}
      >
        <div
          className="px-5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-2"
          style={{ background: tema.bg, color: "#12263A", border: `1px solid ${tema.border}40` }}
        >
          {isIngreso ? <TrendingUp size={14} style={{ color: tema.text }} /> : <TrendingDown size={14} style={{ color: tema.text }} />}
          Tus {tipoVista}
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

      {/* ── CONTENIDO ── */}
      <div className="flex-1 px-8 py-6 flex flex-col gap-5 overflow-y-auto max-w-5xl w-full mx-auto">

        {/* Saldo / total */}
        <div
          className="rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden"
          style={{ background: tema.bg, border: `1px solid ${tema.border}40` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center z-10"
            style={{ background: `${tema.border}25` }}
          >
            {isIngreso ? <TrendingUp size={26} style={{ color: tema.text }} /> : <TrendingDown size={26} style={{ color: tema.text }} />}
          </div>
          <div className="flex-1 z-10">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: tema.text }}>
              {isIngreso ? "Saldo disponible" : "Total de egresos"}
            </div>
            <div className="text-[26px] font-bold" style={{ color: "#12263A" }}>
              ${saldoTotal.toFixed(2)}
            </div>
            <div className="text-[12px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
              {historial.length} {historial.length === 1 ? "movimiento registrado" : "movimientos registrados"}
            </div>
          </div>
          <div
            className="absolute right-[-30px] top-[-30px] w-36 h-36 rounded-full pointer-events-none"
            style={{ background: tema.border, opacity: 0.10 }}
          />
        </div>

        {/* Categorías */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "#668EA5" }}>
            Categorías
          </p>
          <div className="flex items-center gap-2">
            <button className="flex-shrink-0 transition-colors" style={{ color: "#668EA5" }}>
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-3 overflow-x-auto py-1 px-1 flex-1">
              {categorias.map((cat) => {
                const Icono = categoriaIconos[cat] ?? Tag;
                const activo = categoriaSeleccionada === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0 transition-transform duration-150"
                    style={{ transform: activo ? "scale(1.06)" : "scale(1)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                      style={{
                        background: activo ? "#405FFA" : tema.chip,
                        color: activo ? "white" : tema.text,
                      }}
                    >
                      <Icono size={20} />
                    </div>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: activo ? "#405FFA" : "#668EA5" }}
                    >
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
            <button className="flex-shrink-0 transition-colors" style={{ color: "#668EA5" }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Formulario + Lista */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Formulario */}
          <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(18,38,58,0.06)" }}>
            <h3 className="font-bold text-[15px] mb-5" style={{ color: "#12263A" }}>
              Nuevo {isIngreso ? "ingreso" : "egreso"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#668EA5" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder={isIngreso ? "Ej. Mesada de junio" : "Ej. Cine con amigos"}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                  style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: "#12263A", fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = tema.border)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#668EA5" }}>
                    Monto
                  </label>
                  <input
                    type="number"
                    placeholder="$0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: "#12263A", fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = tema.border)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#668EA5" }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: "#12263A", fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = tema.border)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: tema.chip }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tema.text }}>
                  Categoría:
                </span>
                <span className="text-[12px] font-semibold" style={{ color: "#12263A" }}>
                  {categoriaSeleccionada}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setNombre(""); setMonto(""); }}
                  className="px-4 py-2 rounded-full text-[12px] font-bold transition-colors"
                  style={{ background: "#FFFACB", color: "#12263A" }}
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-[12px] font-bold transition-colors"
                  style={{ background: "#FABE0B", color: "#12263A" }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(18,38,58,0.06)" }}>
            <h3 className="font-bold text-[15px] mb-5" style={{ color: "#12263A" }}>
              Historial de {tipoVista}
            </h3>
            <div className="space-y-2.5 h-64 overflow-y-auto pr-1">
              {historial.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                  <Wallet size={28} style={{ color: "#BDE2F2" }} />
                  <p className="text-[12px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
                    Aún no hay {tipoVista} registrados.
                  </p>
                </div>
              ) : (
                historial.map((item, idx) => {
                  const Icono = categoriaIconos[item.tipo] ?? Tag;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl flex items-center justify-between"
                      style={{ background: tema.bg }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "white" }}>
                          <Icono size={16} style={{ color: tema.text }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold" style={{ color: "#12263A" }}>
                            {item.descripcion}
                          </p>
                          <p className="text-[10px]" style={{ color: "#668EA5" }}>
                            {item.tipo} · {item.fecha}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-[14px]" style={{ color: tema.text }}>
                        {isIngreso ? "+" : "-"}${Number(item.monto).toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Consejo (mismo lenguaje visual que "Consejo del día" en Dashboard) */}
        <div
          className="rounded-2xl p-5 flex items-center gap-3 relative overflow-hidden"
          style={{ background: tema.bg, border: `1px solid ${tema.border}40` }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0" style={{ background: `${tema.border}22` }}>
            💡
          </div>
          <p className="text-[12px] font-semibold" style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}>
            {isIngreso
              ? "Separa un porcentaje de cada ingreso apenas lo recibas: tu yo futuro te lo va a agradecer."
              : "Antes de gastar, pregúntate si lo necesitas hoy o si puede esperar hasta la próxima quincena."}
          </p>
        </div>
      </div>

      {/* ── FOOTER (mismo patrón que Dashboard.tsx) ── */}
      <footer
        className="flex items-center justify-between px-8 py-3 flex-shrink-0"
        style={{ background: "#BDE2F2", borderTop: "1px solid rgba(18,38,58,0.08)" }}
      >
        <button className="flex items-center gap-2 text-[12px] font-bold transition-colors" style={{ color: "#668EA5" }}>
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
          onClick={() => onNavigate && onNavigate("contacto")}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ border: "2px solid rgba(18,38,58,0.18)", color: "#668EA5" }}
          title="Ayuda y Soporte"
        >
          <HelpCircle size={16} />
        </button>
      </footer>
    </div>
  );
}