import { useState } from "react";
import { X, Target, Sparkles } from "lucide-react";
import { C } from "./theme.ts";

interface MetaAhorroModalProps {
  abierto: boolean;
  valorInicialNombre?: string;
  valorInicialMonto?: number;
  onGuardar: (nombre: string, monto: number) => void;
  onCerrar: () => void;
}

export default function MetaAhorroModal({
  abierto,
  valorInicialNombre = "",
  valorInicialMonto,
  onGuardar,
  onCerrar,
}: MetaAhorroModalProps) {
  const [nombre, setNombre] = useState(valorInicialNombre);
  const [monto, setMonto] = useState(
    valorInicialMonto ? String(valorInicialMonto) : ""
  );
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  if (!abierto) return null;

  const handleGuardar = () => {
    const montoNum = Number(monto);
    if (!nombre.trim()) {
      setErrorLocal("Ponle un nombre a tu meta.");
      return;
    }
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setErrorLocal("Ingresa un monto objetivo válido.");
      return;
    }
    setErrorLocal(null);
    onGuardar(nombre.trim(), montoNum);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(18,38,58,0.55)",
        backdropFilter: "blur(4px)",
        animation: "fadeInModal .2s ease-out",
      }}
      onClick={onCerrar}
    >
      <style>{`
        @keyframes fadeInModal { from { opacity:0; } to { opacity:1; } }
        @keyframes popInModal { from { opacity:0; transform: scale(.94) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
      `}</style>
      <div
        className="relative w-full max-w-sm rounded-[28px] p-6 border-[3px]"
        style={{
          background: C.cream,
          borderColor: C.navy,
          boxShadow: "0 10px 0 rgba(15,33,56,0.4)",
          animation: "popInModal .25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ background: "rgba(18,38,58,0.06)", color: C.navy }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: C.blueSoft }}
          >
            <Target size={18} color={C.blue} />
          </div>
          <h3
            className="font-extrabold text-[16px]"
            style={{ color: C.navy, fontFamily: "'Space Grotesk',sans-serif" }}
          >
            {valorInicialMonto ? "Editar meta de ahorro" : "Establecer meta de ahorro"}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5"
              style={{ color: C.slate }}
            >
              ¿Para qué estás ahorrando?
            </label>
            <input
              type="text"
              placeholder="Ej. Laptop nueva, viaje, emergencias..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full py-2.5 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-all duration-200"
              style={{
                color: C.navy,
                fontFamily: "'Inter',sans-serif",
                borderColor: "rgba(18,38,58,0.12)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5"
              style={{ color: C.slate }}
            >
              Monto objetivo
            </label>
            <input
              type="number"
              placeholder="$1,000.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full py-2.5 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-all duration-200"
              style={{
                color: C.navy,
                fontFamily: "'JetBrains Mono','Space Mono',ui-monospace,monospace",
                borderColor: "rgba(18,38,58,0.12)",
              }}
            />
          </div>

          {errorLocal && (
            <p className="text-[11px] font-semibold" style={{ color: "#B91C1C" }}>
              {errorLocal}
            </p>
          )}

          <button
            onClick={handleGuardar}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-full text-[13px] font-extrabold border-2 transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{
              background: C.sun,
              color: C.navy,
              borderColor: C.navy,
              boxShadow: `0 5px 0 ${C.navy}`,
            }}
          >
            <Sparkles size={14} /> Guardar meta
          </button>
        </div>
      </div>
    </div>
  );
}