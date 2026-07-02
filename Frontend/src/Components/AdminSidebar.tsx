import { LayoutDashboard, Users, FileText, BarChart3, Settings, LogOut, ChevronLeft } from "lucide-react";
import { useState } from "react";
import BetaLogo from "./BetaLogo";
import { useAuth } from "../context/AuthContext";

type Props = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
};

const ITEMS = [
  { label: "Dashboard", Icon: LayoutDashboard, vista: "admin-dashboard" },
  { label: "Usuarios", Icon: Users, vista: "admin-usuarios" },
  { label: "Contenido", Icon: FileText, vista: "admin-contenido" },
  { label: "Estadísticas", Icon: BarChart3, vista: "admin-estadisticas" },
  { label: "Configuraciones", Icon: Settings, vista: "admin-configuraciones" },
];

export default function AdminSidebar({ vistaActual, cambiarVista }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { usuario, cerrarSesion } = useAuth();

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "66px" : "240px", background: "#12263A", fontFamily: "'Inter',sans-serif" }}
    >
      <div className="flex items-center justify-between p-3.5 min-h-[60px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <BetaLogo size={28} />
            <div className="font-['Space_Grotesk'] text-[12px] font-bold text-white leading-tight whitespace-nowrap">
              BETA
              <div className="text-[9px] font-normal text-[#668EA5]">Panel administrativo</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[#668EA5] transition-colors"
        >
          <ChevronLeft size={15} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .3s" }} />
        </button>
      </div>

      {!collapsed && usuario && (
        <div className="mx-3 mt-3 mb-2 p-3 rounded-2xl bg-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F8910C] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-[12px] font-bold text-white truncate">{usuario.nombre}</div>
            <div className="text-[10px] text-[#F8910C] font-semibold uppercase tracking-wide">Administrador</div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-2.5 py-2 space-y-0.5">
        {ITEMS.map(({ label, Icon, vista }) => {
          const activo = vistaActual === vista;
          return (
            <button
              key={vista}
              onClick={() => cambiarVista(vista)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150"
              style={{ background: activo ? "rgba(248,145,12,0.18)" : "transparent", color: activo ? "#FABE0B" : "#E8EEF2" }}
              onMouseOver={(e) => { if (!activo) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseOut={(e) => { if (!activo) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon size={17} style={{ color: activo ? "#FABE0B" : "#668EA5", flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={() => { cerrarSesion(); cambiarVista("casa"); }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] text-[#F8910C] hover:bg-white/5 transition-colors"
        >
          <LogOut size={15} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}