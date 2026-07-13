import type { CSSProperties } from "react";
import { C } from "./theme.ts";

type Props = {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  onCancelar: () => void;
  onConfirmar: () => void;
  cargando?: boolean;
};

export default function ConfirmModal({ abierto, titulo, mensaje, onCancelar, onConfirmar, cargando }: Props) {
  if (!abierto) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(18,38,58,0.55)", backdropFilter: "blur(2px)" }}
      onClick={onCancelar}
    >
      <div
        className="bg-white rounded-[28px] p-7 max-w-sm w-full border-[3px]"
        style={{ borderColor: C.navy, boxShadow: "0 20px 50px rgba(15,33,56,0.3)", animation: "popInModal .25s cubic-bezier(.34,1.56,.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes popInModal { from { opacity:0; transform: scale(.85) rotate(-2deg);} to { opacity:1; transform: scale(1) rotate(0);} }
          .gummyModal { box-shadow: 0 5px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
          .gummyModal:hover { transform: translateY(-2px); box-shadow: 0 7px 0 var(--g,#12263A); }
          .gummyModal:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--g,#12263A); }
        `}</style>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-[22px]" style={{ background: "rgba(248,145,12,0.15)" }}>⚠️</div>
        <h3 className="font-['Space_Grotesk'] font-extrabold text-[17px] mb-2" style={{ color: C.navy }}>{titulo}</h3>
        <p className="text-[13px] mb-6" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>{mensaje}</p>
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancelar}
            disabled={cargando}
            className="px-4 py-2.5 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-95 active:scale-95 border-2"
            style={{ background: C.cream, color: C.navy, borderColor: "rgba(18,38,58,0.15)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className="gummyModal px-4 py-2.5 rounded-full text-[12px] font-extrabold border-2"
            style={{ background: C.mandarin, color: "white", borderColor: C.navy, opacity: cargando ? 0.7 : 1, "--g": C.navy } as CSSProperties}
          >
            {cargando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
