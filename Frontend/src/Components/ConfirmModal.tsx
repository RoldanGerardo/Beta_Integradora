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
      style={{ background: "rgba(18,38,58,0.45)" }}
      onClick={onCancelar}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-[popIn_.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes popIn { from { opacity:0; transform: scale(.94);} to { opacity:1; transform: scale(1);} }`}</style>
        <h3 className="font-['Space_Grotesk'] font-bold text-[16px] mb-2" style={{ color: "#12263A" }}>
          {titulo}
        </h3>
        <p className="text-[13px] mb-6" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
          {mensaje}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancelar}
            disabled={cargando}
            className="px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-95 active:scale-95"
            style={{ background: "#F4EDEA", color: "#12263A" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className="px-4 py-2 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-105 active:scale-95"
            style={{ background: "#F8910C", color: "white", opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}