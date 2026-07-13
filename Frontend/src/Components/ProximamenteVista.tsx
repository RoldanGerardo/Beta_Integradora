import { Beto } from "./Ilustraciones";
import { C } from "./theme.ts";

type Props = {
  vista: string;
  onVolver: () => void;
};

export default function ProximamenteVista({ vista, onVolver }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ background: C.cream, fontFamily: "'Space Grotesk',sans-serif" }}>
      <Beto size={100} mood="cheer" />
      <p className="text-[16px] font-bold" style={{ color: C.navy }}>
        Vista <code className="bg-white px-2 py-0.5 rounded-lg border-2" style={{ borderColor: C.navy }}>{vista}</code> — próximamente
      </p>
      <button onClick={onVolver} className="text-[13px] px-4 py-2 rounded-full font-bold border-2" style={{ background: C.sun, color: C.navy, borderColor: C.navy }}>
        ← Volver al inicio
      </button>
    </div>
  );
}
