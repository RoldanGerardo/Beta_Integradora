import { ReactNode, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Home, Mail, LogIn, UserPlus, Settings, PieChart, Info,
  BookOpen, Activity, Bell, LogOut, Sparkles,
} from "lucide-react";
import BetaLogo from "./BetaLogo";
import { useAuth } from "../context/AuthContext";
import { C } from "./theme.ts";

type SidebarProps = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
};

const RAIL = 78;
const PANEL = 264;

const VISTAS_AUTENTICADAS = [
  "dashboard",
  "ingresos",
  "egresos",
  "cuestionarios",
  "articulos",
  "quincenales",
  "mensuales",
  "reportes",
];

/* Envoltorio común de la barra lateral: header con logo + espacio para
   contenido + pie fijo (usado tanto para el menú público como el de usuario) */
type ShellProps = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  children: ReactNode;
  footer?: ReactNode;
};

function Shell({ expanded, setExpanded, children, footer }: ShellProps) {
  return (
    <>
      <div className="flex-shrink-0 h-screen" style={{ width: RAIL }} />
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="fixed left-0 top-0 h-screen flex flex-col transition-[width] duration-300 ease-out"
        style={{ width: expanded ? PANEL : RAIL, background: "#132A40", borderRight: "1px solid rgba(255,255,255,0.06)", zIndex: 40, boxShadow: expanded ? "8px 0 30px rgba(0,0,0,0.25)" : "none", fontFamily: "'Inter',sans-serif", overflow: "hidden" }}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0" style={{ minHeight: 68 }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: C.sun }}>
            <BetaLogo size={22} />
          </div>
          <div className="overflow-hidden whitespace-nowrap font-['Space_Grotesk'] font-extrabold text-[14px] text-white leading-tight" style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>
            BETA<div className="text-[10px] font-medium" style={{ color: "#7C93A6" }}>Finanzas para jóvenes</div>
          </div>
        </div>
        {children}
        {footer && <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>{footer}</div>}
      </aside>
    </>
  );
}

type NavButtonProps = {
  active: boolean;
  Icon: LucideIcon;
  label: string;
  color: string;
  expanded: boolean;
  onClick: () => void;
  hasChevron?: boolean;
  chevronOpen?: boolean;
};

function NavButton({ active, Icon, label, color, expanded, onClick, hasChevron, chevronOpen }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-150 whitespace-nowrap"
      style={{ background: active ? `${color}22` : "transparent", color: active ? color : "#C7D4DE" }}
      onMouseOver={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
      onMouseOut={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200" style={{ background: active ? color : "rgba(255,255,255,0.06)", transform: active ? "scale(1.05)" : "none" }}>
        <Icon size={17} color={active ? "#12263A" : color} strokeWidth={2.3} />
      </div>
      <span className="flex-1 text-left overflow-hidden" style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>{label}</span>
      {hasChevron && expanded && <span className="text-[10px]" style={{ color: "#7C93A6", transform: chevronOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▸</span>}
    </button>
  );
}

type SidebarVariantProps = {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  cambiarVista: (vista: string) => void;
  vistaActual: string;
};

function SidebarUsuario({ expanded, setExpanded, cambiarVista, vistaActual }: SidebarVariantProps) {
  const menuItems = [
    { label: "Inicio", Icon: Home, color: C.blue, vista: "dashboard", sub: [] as { label: string; vista: string }[] },
    { label: "Movimientos", Icon: Activity, color: C.moss, vista: "", sub: [{ label: "💰 Ingresos", vista: "ingresos" }, { label: "🛍️ Egresos", vista: "egresos" }] },
    { label: "Módulo educativo", Icon: BookOpen, color: C.sun, vista: "", sub: [{ label: "Cuestionarios", vista: "cuestionarios" }, { label: "Artículos", vista: "articulos" }] },
    { label: "Reportes", Icon: PieChart, color: C.mandarin, vista: "", sub: [{ label: "Quincenales", vista: "quincenales" }, { label: "Mensuales", vista: "mensuales" }] },
    { label: "Contáctanos", Icon: Mail, color: C.turquoise, vista: "contacto", sub: [] },
    { label: "Acerca de", Icon: Info, color: C.turquoise, vista: "acerca", sub: [] },
  ];
  const menuActivo = menuItems.find((m) => m.sub.some((s) => s.vista === vistaActual))?.label ?? null;
  const [openMenu, setOpenMenu] = useState<string | null>(menuActivo);
  const { cerrarSesion } = useAuth();

  return (
    <Shell
      expanded={expanded}
      setExpanded={setExpanded}
      footer={
        <>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold text-[#C7D4DE] hover:bg-white/5 transition-colors whitespace-nowrap">
            <Settings size={15} /><span style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>Configuración</span>
          </button>
          <button
            onClick={() => { cerrarSesion(); cambiarVista("casa"); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-colors"
            style={{ color: C.mandarin }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,145,12,0.10)")}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <LogOut size={15} /><span style={{ opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>Cerrar sesión</span>
          </button>
        </>
      }
    >
      {expanded && (
        <div className="mx-3 mb-3 p-3 rounded-2xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm" style={{ background: C.blue }}>U</div>
          <div className="overflow-hidden">
            <div className="text-[12px] font-bold text-white truncate">usuario_67</div>
            <div className="text-[10px]" style={{ color: C.moss }}>🔥 racha activa</div>
          </div>
          <Bell size={14} className="ml-auto flex-shrink-0" color="#7C93A6" />
        </div>
      )}
      <nav className="flex-1 px-3 overflow-y-auto space-y-1 pb-2">
        {menuItems.map(({ label, Icon, color, vista, sub }) => {
          const activoDirecto = vista !== "" && vistaActual === vista;
          const activoPorSubmenu = sub.some((s) => s.vista === vistaActual);
          return (
            <div key={label}>
              <NavButton
                active={activoDirecto || activoPorSubmenu}
                Icon={Icon}
                label={label}
                color={color}
                expanded={expanded}
                hasChevron={sub.length > 0}
                chevronOpen={openMenu === label}
                onClick={() => (sub.length ? setOpenMenu(openMenu === label ? null : label) : cambiarVista(vista))}
              />
              {expanded && openMenu === label && sub.length > 0 && (
                <div className="pl-11 pr-2 pt-1 pb-1 space-y-0.5">
                  {sub.map((s) => {
                    const activo = vistaActual === s.vista;
                    return (
                      <button
                        key={s.vista}
                        onClick={() => cambiarVista(s.vista)}
                        className="w-full text-left text-[12px] px-2.5 py-1.5 rounded-lg transition-colors font-semibold whitespace-nowrap"
                        style={{ color: activo ? color : "#8CA0B0", background: activo ? `${color}1A` : "transparent" }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </Shell>
  );
}

function SidebarPublico({ expanded, setExpanded, cambiarVista, vistaActual }: SidebarVariantProps) {
  const navLinks = [
    { id: "casa", label: "Inicio", Icon: Home, color: C.blue },
    { id: "login", label: "Iniciar sesión", Icon: LogIn, color: C.turquoise },
    { id: "registro", label: "Registrarse", Icon: UserPlus, color: C.sun },
    { id: "acerca", label: "Acerca de", Icon: Info, color: C.mandarin },
    { id: "contacto", label: "Contáctanos", Icon: Mail, color: C.moss },
  ];
  return (
    <Shell
      expanded={expanded}
      setExpanded={setExpanded}
      footer={
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: "rgba(250,190,11,0.10)" }}>
          <Sparkles size={14} color={C.sun} />
          <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: C.sun, opacity: expanded ? 1 : 0, transition: "opacity .2s" }}>Aprende de forma interactiva</span>
        </div>
      }
    >
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navLinks.map(({ id, label, Icon, color }) => (
          <NavButton key={id} active={vistaActual === id} Icon={Icon} label={label} color={color} expanded={expanded} onClick={() => cambiarVista(id)} />
        ))}
      </nav>
    </Shell>
  );
}

export default function Sidebar({ vistaActual, cambiarVista }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const { usuario } = useAuth();
  const autenticado = !!usuario || VISTAS_AUTENTICADAS.includes(vistaActual);

  if (autenticado) {
    return <SidebarUsuario expanded={expanded} setExpanded={setExpanded} cambiarVista={cambiarVista} vistaActual={vistaActual} />;
  }
  return <SidebarPublico expanded={expanded} setExpanded={setExpanded} cambiarVista={cambiarVista} vistaActual={vistaActual} />;
}