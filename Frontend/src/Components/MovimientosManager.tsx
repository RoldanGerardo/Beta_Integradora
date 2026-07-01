import React, { useState, useEffect } from "react";
import { PlusCircle, ArrowUpRight, ArrowDownLeft, Calendar, FileText, DollarSign } from "lucide-react";

interface MovimientoData {
  id: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: string;
  detalle: string;
}

export default function MovimientosManager() {
  // Estados para el formulario
  const [categoria, setCategoria] = useState<"ingreso" | "egreso">("ingreso");
  const [monto, setMonto] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);
  const [tipo, setTipo] = useState<string>("Alineación"); // Opciones dinámicas para el taller financiero

  // Estado para la lista del backend
  const [movimientos, setMovimientos] = useState<MovimientoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mensajeStatus, setMensajeStatus] = useState<{ texto: string; error: boolean } | null>(null);

  // Cargar movimientos desde el backend al montar el componente
  const cargarMovimientos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/movimientos");
      if (response.ok) {
        const data = await response.json();
        setMovimientos(data);
      }
    } catch (error) {
      console.error("Error de conexión con el servidor de la API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  // Enviar el formulario para instanciar en el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeStatus(null);

    if (!monto || !descripcion || !fecha || !tipo) {
      setMensajeStatus({ texto: "Por favor, completa todos los campos requeridos.", error: true });
      return;
    }

    const nuevoRegistro = {
      monto: Number(monto),
      descripcion,
      fecha,
      tipo,
      categoria
    };

    try {
      const response = await fetch("http://localhost:5000/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRegistro)
      });

      if (response.ok) {
        setMensajeStatus({ texto: "¡Movimiento procesado e instanciado correctamente!", error: false });
        setMonto("");
        setDescripcion("");
        cargarMovimientos(); // Recargar la lista con el nuevo estado del backend
      } else {
        const errData = await response.json();
        setMensajeStatus({ texto: errData.mensaje || "Error al registrar.", error: true });
      }
    } catch (error) {
      setMensajeStatus({ texto: "No se pudo conectar con el servidor backend.", error: true });
    }
  };

  return (
    <div className="flex-1 min-h-screen p-8 flex flex-col lg:flex-row gap-8" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* SECCIÓN IZQUIERDA: Formulario Operativo */}
      <div className="w-full lg:w-5/12 bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-[#405FFA]/10 text-[#405FFA]">
              <DollarSign size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#12263A]">Registrar Operación</h2>
              <p className="text-xs text-[#668EA5]">Introduce los flujos de caja del taller mecánico</p>
            </div>
          </div>

          {/* Selector de Categoría Flujo de Caja */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setCategoria("ingreso"); setTipo("Alineación"); }}
              className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                categoria === "ingreso"
                  ? "bg-[#E6FBDA] border-[#84D175] text-[#707D4E]"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ArrowUpRight size={18} /> Ingreso
            </button>
            <button
              type="button"
              onClick={() => { setCategoria("egreso"); setTipo("Refacciones"); }}
              className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                categoria === "egreso"
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ArrowDownLeft size={18} /> Egreso
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#12263A] uppercase tracking-wider mb-1">Monto ($ MXN)</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#405FFA] text-sm text-[#12263A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12263A] uppercase tracking-wider mb-1">Concepto / Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#405FFA] text-sm text-[#12263A]"
              >
                {categoria === "ingreso" ? (
                  <>
                    <option value="Alineación">Servicio de Alineación</option>
                    <option value="Balanceo">Servicio de Balanceo</option>
                    <option value="Diagnóstico">Diagnóstico General</option>
                    <option value="Mano de Obra">Mano de Obra Directa</option>
                  </>
                ) : (
                  <>
                    <option value="Refacciones">Compra de Refacciones</option>
                    <option value="Herramientas">Mantenimiento de Maquinaria</option>
                    <option value="Insumos">Insumos de Taller (Aceites/Fluidos)</option>
                    <option value="Servicios Públicos">Gastos de Operación (Luz/Agua)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12263A] uppercase tracking-wider mb-1">Fecha de Ejecución</label>
              <div className="relative">
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#405FFA] text-sm text-[#12263A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12263A] uppercase tracking-wider mb-1">Descripción Breve</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe los detalles específicos del movimiento..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#405FFA] text-sm text-[#12263A] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-[#12263A] flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: "#FABE0B" }}
            >
              <PlusCircle size={18} /> Procesar en Simulador
            </button>
          </form>
        </div>

        {mensajeStatus && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-medium border ${
            mensajeStatus.error ? "bg-red-50 border-red-100 text-red-600" : "bg-[#E6FBDA] border-[#84D175]/30 text-[#707D4E]"
          }`}>
            {mensajeStatus.texto}
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: Visualización y Ledger del Backend */}
      <div className="flex-1 bg-[#F4EDEA] rounded-2xl p-6 border border-black/5 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#12263A]">Historial de Caja Simulado</h2>
          <p className="text-xs text-[#668EA5]">Registros validados mediante polimorfismo en el servidor</p>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[520px] pr-2 space-y-3">
          {loading ? (
            <p className="text-sm text-center py-8 text-[#668EA5]">Sincronizando flujos financieros...</p>
          ) : movimientos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl bg-white/50">
              <p className="text-sm text-[#668EA5]">No hay transacciones registradas en el turno actual.</p>
            </div>
          ) : (
            movimientos.map((mov) => {
              const esIngreso = mov.detalle.startsWith("Ingreso");
              return (
                <div
                  key={mov.id}
                  className="bg-white p-4 rounded-xl border border-black/5 shadow-sm flex items-start justify-between hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl mt-0.5 ${esIngreso ? "bg-[#E6FBDA] text-[#84D175]" : "bg-red-50 text-red-500"}`}>
                      {esIngreso ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 uppercase tracking-wide bg-gray-100 text-[#12263A]">
                        {mov.tipo}
                      </span>
                      <p className="text-sm font-semibold text-[#12263A] mb-0.5">{mov.descripcion}</p>
                      <p className="text-xs text-gray-400 font-mono italic">{mov.detalle}</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end justify-between h-full">
                    <span className={`text-sm font-bold ${esIngreso ? "text-green-600" : "text-red-600"}`}>
                      {esIngreso ? "+" : "-"} ${mov.monto.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-[#668EA5] flex items-center gap-1 mt-2">
                      <Calendar size={12} /> {mov.fecha}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}