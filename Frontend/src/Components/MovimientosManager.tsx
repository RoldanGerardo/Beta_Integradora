/* ─────────────────────────────────────────────────
   src/Components/MovimientosManager.tsx
   ───────────────────────────────────────────────── */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wallet, CheckCircle } from "lucide-react";

interface MovimientosProps {
  tipoVista: "ingresos" | "egresos" | "balance";
}

export default function MovimientosManager({ tipoVista }: MovimientosProps) {
  const isIngreso = tipoVista === "ingresos";
  
  // Categorías según la vista (Círculos)
  const categorias = isIngreso 
    ? ["Becas", "Mesada", "Trabajo", "Regalos", "Ventas"] 
    : ["Comida", "Transporte", "Escuela", "Salidas", "Ropa"];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  
  // Datos del backend
  const [historial, setHistorial] = useState<any[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  // Cargar datos
  const cargarMovimientos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/movimientos");
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo los del tipo actual para la lista
        const dataFiltrada = data.filter((mov: any) => 
          isIngreso ? mov.detalle.includes("Ingreso") : mov.detalle.includes("Egreso")
        );
        setHistorial(dataFiltrada);

        // Calcular total
        const total = dataFiltrada.reduce((acc: number, curr: any) => acc + Number(curr.monto), 0);
        setSaldoTotal(total);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, [tipoVista]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !monto || !fecha) return;

    const nuevoRegistro = {
      monto: Number(monto),
      descripcion: nombre,
      fecha,
      tipo: categoriaSeleccionada,
      categoria: isIngreso ? "ingreso" : "egreso"
    };

    try {
      const response = await fetch("http://localhost:5000/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoRegistro)
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
      <div className="flex-1 p-8 bg-[#FFFACB] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-[#12263A]">Vista de Balance Global en Construcción 🚧</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen relative font-['Space_Grotesk'] overflow-y-auto" style={{ background: "#FFFACB" }}>
      
      {/* Contenedor Principal Limitado */}
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
        
        {/* Placeholder Imagen Superior */}
        <div className="w-full h-40 bg-black/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-black/20">
          <p className="font-bold text-[#12263A]/50 text-sm uppercase tracking-widest text-center px-4">
            [IMAGEN O ILUSTRACIÓN ALUSIVA A LOS {isIngreso ? "INGRESOS" : "EGRESOS"}]
          </p>
        </div>

        {/* Título Amarillo */}
        <h1 className="bg-[#FABE0B] text-white px-8 py-2 rounded-full font-bold text-lg md:text-xl uppercase shadow-sm mb-6">
          Bienvenido a tus {tipoVista}
        </h1>

        {/* Carrusel de Categorías */}
        <p className="text-xs font-bold text-[#12263A] uppercase tracking-widest mb-3">Categorías</p>
        <div className="flex items-center gap-4 mb-8 w-full justify-center">
          <button className="text-gray-400 hover:text-black"><ChevronLeft size={24}/></button>
          <div className="flex gap-4 overflow-x-auto py-2 px-1">
            {categorias.map((cat) => (
              <div key={cat} onClick={() => setCategoriaSeleccionada(cat)} className="flex flex-col items-center gap-2 cursor-pointer">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                  categoriaSeleccionada === cat 
                  ? "bg-[#405FFA] text-white shadow-md transform scale-110" 
                  : "bg-black/40 text-black/40"
                }`}>
                  ?
                </div>
                <span className={`text-xs font-bold ${categoriaSeleccionada === cat ? "text-[#405FFA]" : "text-[#12263A]"}`}>{cat}</span>
              </div>
            ))}
          </div>
          <button className="text-gray-400 hover:text-black"><ChevronRight size={24}/></button>
        </div>

        {/* Tarjeta de Saldo */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 flex items-center gap-4 pr-12 mb-8">
          <div className="w-12 h-12 bg-[#E6FBDA] rounded-xl flex items-center justify-center text-[#84D175]">
            <Wallet size={24} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${isIngreso ? 'text-[#84D175]' : 'text-[#F8910C]'}`}>
              ${saldoTotal.toFixed(2)}
            </div>
            <div className="text-[11px] font-bold text-[#12263A] uppercase">
              {isIngreso ? "Saldo disponible" : "Egresos Totales"}
            </div>
          </div>
        </div>

        {/* Formularios y Listas Split */}
        <div className="w-full grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Formulario (Nuevo) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
            <h3 className="text-center font-bold text-[#405FFA] mb-6">Nuevo {isIngreso ? "ingreso" : "egreso"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#12263A] ml-2">Nombre del {isIngreso ? "ingreso" : "egreso"}</label>
                <input type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} className="w-full bg-[#BDE2F2]/40 rounded-full px-4 py-2 mt-1 text-sm outline-none focus:ring-2 ring-[#405FFA]" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-[#12263A] ml-2">Categoría</label>
                <div className="w-full bg-[#BDE2F2]/40 rounded-full px-4 py-2 mt-1 text-sm text-[#668EA5] truncate">
                  {categoriaSeleccionada}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#12263A] ml-2">Monto</label>
                  <input type="number" value={monto} onChange={(e)=>setMonto(e.target.value)} className="w-full bg-[#BDE2F2]/40 rounded-full px-4 py-2 mt-1 text-sm outline-none focus:ring-2 ring-[#405FFA]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#12263A] ml-2">Fecha</label>
                  <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} className="w-full bg-[#BDE2F2]/40 rounded-full px-4 py-2 mt-1 text-sm outline-none focus:ring-2 ring-[#405FFA]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={()=>{setNombre(""); setMonto("")}} className="px-4 py-1.5 rounded-full text-xs font-bold text-[#12263A] bg-[#FFFACB]">Descartar</button>
                <button type="submit" className="px-4 py-1.5 rounded-full text-xs font-bold text-[#12263A] bg-[#FABE0B]">Guardar</button>
              </div>
            </form>
          </div>

          {/* Lista de Registros */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
            <h3 className="text-center font-bold text-[#405FFA] mb-6">Lista de {tipoVista}</h3>
            <div className="space-y-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
              {historial.length === 0 ? (
                <p className="text-center text-sm text-gray-400 mt-10">No hay registros aún.</p>
              ) : (
                historial.map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl flex items-center justify-between ${isIngreso ? 'bg-[#E6FBDA]/50' : 'bg-[#FFF3E0]/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-6 rounded-full ${isIngreso ? 'bg-[#84D175]/30' : 'bg-[#F8910C]/30'}`}></div>
                      <div>
                        <p className="text-sm font-bold text-[#12263A]">{item.descripcion}</p>
                        <p className="text-[10px] text-[#668EA5]">{item.tipo} - {item.fecha}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${isIngreso ? 'text-[#84D175]' : 'text-[#F8910C]'}`}>
                      ${Number(item.monto).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Banner de Consejo Inferior */}
        <div className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-full border border-black/5 flex items-center justify-center gap-4 mb-20 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#BDE2F2] flex items-center justify-center text-xl">
             💡
          </div>
          <p className="text-sm font-bold text-[#405FFA] uppercase tracking-wider">
            [AQUÍ IRÁ UN CONSEJO SOBRE {isIngreso ? "EL AHORRO" : "LA SALUD FINANCIERA"}]
          </p>
        </div>

      </div>
    </div>
  );
}