import { LayoutDashboard, Users, FileText, BarChart3, Settings, LogOut, ArrowLeftCircle } from "lucide-react";
import { useState } from "react";
import BetaLogo from "./BetaLogo";
import { useAuth } from "../context/AuthContext";
import { C } from "./theme.ts";

type Props = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
};

const RAIL = 78;
const PANEL = 264;

const ADMIN_ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, vista: "admin-dashboard", color: C.blue },
  { label: "Usuarios", Icon: Users, vista: "admin-usuarios", color: C.turquoise },
  { label: "Contenido", Icon: FileText, vista: "admin-contenido", color: C.moss },
  { label: "Estadísticas", Icon: BarChart3, vista: "admin-estadisticas", color: C.sun },
  { label: "Configuraciones", Icon: Settings, vista: "admin-configuraciones", color: "#9AA9B6" },
];

export default function AdminSidebar({ vistaActual, cambiarVista }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { usuario, cerrarSesion } = useAuth();

  return (
    <>
      <div className="flex-shrink-0 h-screen" style={{ width: RAIL }} />
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="fixed left-0 top-0 h-screen flex flex-col transition-[width] duration-300 ease-out"
        style={{ width: expanded ? PANEL : RAIL, background: "#0B1A2B", zIndex: 40, boxShadow: expanded ? "8px 0 30px rgba(0,0,0,0.3)" : "none", fontFamily: "'Inter',sans-serif", overflow: "hidden" }}
      >
        <div className="flex items-center gap-2.5 px-4 py-4" style={{ minHeight: 68, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(250,190,11,0.15)", border: `1.5px solid ${C.sun}` }}>
            <BetaLogo size={20} />
          </div>
          <div className="overflow-hidden whitespace-nowrap font-['Space_Grotesk'] font-extrabold text-[13px] text-white" style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>
            BETA
            <div className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: C.sun }}>Panel administrativo</div>
          </div>
        </div>

        {expanded && usuario && (
          <div className="mx-3 mt-3 mb-2 p-3 rounded-2xl bg-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ background: C.mandarin }}>
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-[12px] font-bold text-white truncate">{usuario.nombre}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.sun }}>Administrador</div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-1">
          {ADMIN_ITEMS.map(({ label, Icon, vista, color }) => {
            const activo = vistaActual === vista;
            return (
              <button
                key={vista}
                onClick={() => cambiarVista(vista)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-150 whitespace-nowrap"
                style={{ background: activo ? `${color}22` : "transparent", color: activo ? color : "#C7D4DE" }}
                onMouseOver={(e) => { if (!activo) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseOut={(e) => { if (!activo) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: activo ? color : "rgba(255,255,255,0.06)" }}>
                  <Icon size={17} color={activo ? "#0F2138" : color} strokeWidth={2.2} />
                </div>
                <span style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => cambiarVista("casa")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-colors" style={{ color: "#9AA9B6" }}>
            <ArrowLeftCircle size={15} />
            <span style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>Ver sitio público</span>
          </button>
          <button onClick={() => { cerrarSesion(); cambiarVista("casa"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-colors" style={{ color: C.mandarin }}>
            <LogOut size={15} />
            <span style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}