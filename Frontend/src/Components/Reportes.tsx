import { useState } from "react";
import { Mail, HelpCircle, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { Movimiento } from "../models/Movimiento";

type Props = { onNavigate: (vista: string) => void; };

const mockHistorial: Movimiento[] = [
  { id: 1, tipo: "ingreso", monto: 1000, descripcion: "Mesada mensual", fecha: "28/05/2026" },
  { id: 2, tipo: "egreso", monto: 450, descripcion: "Juego Steam", fecha: "29/05/2026" },
  { id: 3, tipo: "egreso", monto: 150, descripcion: "Snacks", fecha: "30/05/2026" },
  { id: 4, tipo: "ingreso", monto: 500, descripcion: "Venta de teclado", fecha: "01/06/2026" },
  { id: 5, tipo: "egreso", monto: 300, descripcion: "Salida al cine", fecha: "02/06/2026" },
  { id: 6, tipo: "egreso", monto: 700, descripcion: "Suscripciones", fecha: "03/06/2026" },
];

export default function Reportes({ onNavigate }: Props) {
  const [filtro, setFiltro] = useState<'quincenal' | 'mensual'>('mensual');

  // Lógica de filtrado: si es quincenal, solo muestra los primeros 15 días
  const historialFiltrado = mockHistorial.filter(mov => {
    const dia = parseInt(mov.fecha.split('/')[0]);
    return filtro === 'quincenal' ? dia <= 15 : true;
  });

  const ingresos = historialFiltrado.filter(m => m.tipo === "ingreso").reduce((a, b) => a + b.monto, 0);
  const egresos = historialFiltrado.filter(m => m.tipo === "egreso").reduce((a, b) => a + b.monto, 0);
  const balance = ingresos - egresos;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: "#FFFACB" }}>
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
        
        {/* Selector de Filtro */}
        <div className="flex gap-2 mb-6">
          {(['quincenal', 'mensual'] as const).map((f) => (
            <button 
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-6 py-2 rounded-full font-bold uppercase text-[12px] transition-colors ${filtro === f ? 'bg-[#405FFA] text-white' : 'bg-white text-[#405FFA]'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full max-w-4xl space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col h-[320px]">
            <h3 className="font-bold text-center mb-4 text-[#405FFA]">Historial {filtro}</h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {historialFiltrado.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F4EDEA]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: mov.tipo === "ingreso" ? "#E6FBDA" : "rgba(248,145,12,0.15)" }}>
                      {mov.tipo === "ingreso" ? <TrendingUp size={18} color="#84D175" /> : <TrendingDown size={18} color="#F8910C" />}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#12263A]">{mov.descripcion}</p>
                      <p className="text-[11px] text-[#668EA5]">{mov.fecha}</p>
                    </div>
                  </div>
                  <div className="font-bold text-[15px]" style={{ color: mov.tipo === "ingreso" ? "#84D175" : "#F8910C" }}>
                    {mov.tipo === "ingreso" ? "+" : "-"}${mov.monto.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tarjeta de Resumen */}
          <div className="bg-white rounded-3xl shadow-sm p-8 grid grid-cols-2 gap-8">
            <div>
              <p>Ingresos: ${ingresos.toFixed(2)}</p>
              <p>Egresos: ${egresos.toFixed(2)}</p>
              <p className="font-bold">Diferencia: ${balance.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[14px]">El usuario ha gastado {balance >= 0 ? "menos" : "más"} que sus ingresos.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full py-4 px-6 flex items-center justify-between bg-[#BDE2F2]">
        <Mail size={20} color="white" />
        <span className="text-white font-bold text-[12px]">BETA: Finanzas para jóvenes</span>
        <HelpCircle size={22} color="white" className="cursor-pointer" onClick={() => onNavigate("contacto")} />
      </div>
    </div>
  );
}