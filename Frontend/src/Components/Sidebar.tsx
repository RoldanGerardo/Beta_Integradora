/* ─────────────────────────────────────────────────
   src/Components/Sidebar.tsx
   ───────────────────────────────────────────────── */
import { useState } from "react";
import {
  Home, Mail, ChevronLeft, LogIn, UserPlus,
  Settings, FileText, PieChart, Info,
  BookOpen, Activity, Bell, LogOut,
} from "lucide-react";
import BetaLogo from "./BetaLogo";

type SidebarProps = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
};

/* ── Ilustración SVG sidebar público ─────────────────────────
   Gráfica de barras colorida con pajarito BETA volando.
   Para reemplazar: <img src="/assets/sidebar-illu.png" ... />
   ─────────────────────────────────────────────────────────── */
function SidebarIllu() {
  return (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full" aria-hidden="true">
      <rect width="200" height="160" fill="#F4EDEA" />
      {/* Cielo suave */}
      <rect width="200" height="80" fill="#BDE2F2" opacity=".20" />
      {/* Sol */}
      <circle cx="168" cy="28" r="18" fill="#FABE0B" opacity=".22" />
      <circle cx="168" cy="28" r="11" fill="#FABE0B" opacity=".40" />
      {/* Nubes */}
      <ellipse cx="42" cy="24" rx="18" ry="8" fill="white" opacity=".60" />
      <ellipse cx="56" cy="20" rx="13" ry="7" fill="white" opacity=".50" />
      <ellipse cx="118" cy="18" rx="14" ry="6" fill="white" opacity=".40" />
      {/* Barras */}
      {[
        { x:22,  h:44, y:90,  c:"#BDE2F2" },
        { x:44,  h:56, y:78,  c:"#FABE0B" },
        { x:66,  h:68, y:66,  c:"#26CBD1" },
        { x:88,  h:50, y:84,  c:"#84D175" },
        { x:110, h:74, y:60,  c:"#F8910C" },
        { x:132, h:60, y:74,  c:"#668EA5" },
        { x:154, h:46, y:88,  c:"#FABE0B" },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="16" height={b.h} rx="4" fill={b.c} />
      ))}
      {/* Línea base */}
      <line x1="16" y1="136" x2="178" y2="136"
        stroke="#12263A" strokeWidth="1" opacity=".08" />
      {/* Línea de tendencia */}
      <polyline
        points="30,110 52,90 74,76 96,96 118,66 140,82 162,100"
        fill="none" stroke="#F8910C" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" opacity=".70" />
      {[[30,110],[52,90],[74,76],[96,96],[118,66],[140,82]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#F8910C" />
      ))}
      {/* Pajarito BETA */}
      <g transform="translate(80,38) rotate(-10)">
        <path d="M0 0 C-7 -4 -13 -2 -15 2 C-11 0 -8 1 -6 3 Z" fill="#405FFA" />
        <path d="M0 0 C-5 -2 -8 0 -6 3 Z" fill="#6B83FB" opacity=".7" />
        <circle cx="2.5" cy="-1" r="3" fill="#405FFA" />
        <path d="M4 -1.5 L7.5 -0.5 L4 0.5Z" fill="#12263A" />
      </g>
      {/* Monedas */}
      <circle cx="52" cy="44" r="6" fill="#FABE0B" opacity=".75" />
      <text x="52" y="48" textAnchor="middle" fontSize="7"
        fontWeight="700" fill="#AE6D21">$</text>
      <circle cx="140" cy="36" r="5" fill="#84D175" opacity=".70" />
      <text x="140" y="40" textAnchor="middle" fontSize="6"
        fontWeight="700" fill="#707D4E">$</text>
      {/* Label */}
      <text x="100" y="150" textAnchor="middle"
        fontFamily="Space Grotesk,sans-serif" fontSize="8"
        fontWeight="600" fill="#12263A" opacity=".35">
        balance mensual
      </text>
    </svg>
  );
}

/* ── Ilustración mini para sidebar colapsado ───────────────── */
function MiniIllu() {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      {["#FABE0B","#26CBD1","#84D175","#F8910C"].map((c, i) => (
        <div key={i} className="w-7 rounded-full"
          style={{ height: 6 + i * 3, background: c, opacity: .75 }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR DASHBOARD (usuario logueado)
   ══════════════════════════════════════════════════════════════ */
function SidebarDashboard({
  collapsed, setCollapsed, cambiarVista,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  cambiarVista: (v: string) => void;
}) {
  const menuItems = [
    { label: "Inicio",           Icon: Home,      color: "#405FFA", sub: [] },
    { label: "Movimientos",      Icon: Activity,  color: "#84D175",
      sub: ["Ingresos","Egresos","Balance"] },
    { label: "Módulo educativo", Icon: BookOpen,  color: "#FABE0B",
      sub: ["Cuestionarios","Artículos"] },
    { label: "Reportes",         Icon: PieChart,  color: "#F8910C",
      sub: ["Quincenales","Mensuales"] },
    { label: "Contáctanos",      Icon: Mail,      color: "#668EA5", sub: [] },
    { label: "Acerca de",        Icon: Info,      color: "#668EA5", sub: [] },
  ];

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out h-screen relative"
      style={{
        width: collapsed ? "66px" : "240px",
        background: "#F4EDEA",
        borderRight: "1px solid rgba(18,38,58,0.08)",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 min-h-[60px]">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <BetaLogo size={30} />
            <div className="font-['Space_Grotesk'] text-[13px] font-bold text-[#12263A] leading-tight whitespace-nowrap">
              BETA
              <div className="text-[10px] font-normal text-[#668EA5]">Finanzas para jóvenes</div>
            </div>
          </div>
        )}
        {collapsed && <BetaLogo size={28} />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-black/5 text-[#668EA5] flex-shrink-0 transition-colors"
        >
          <ChevronLeft
            size={15}
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .3s" }}
          />
        </button>
      </div>

      {/* Perfil */}
      {!collapsed ? (
        <div className="mx-3 mb-3 p-3 rounded-2xl bg-white/60 border border-black/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#405FFA] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            U
            {/* Reemplaza con: <img src="/assets/avatar.png" className="w-full h-full rounded-full object-cover" /> */}
          </div>
          <div className="overflow-hidden">
            <div className="text-[12px] font-bold text-[#12263A] truncate">usuario_67</div>
            <div className="text-[10px] text-[#668EA5]">Cuenta activa</div>
          </div>
          <button className="ml-auto text-[#668EA5] hover:text-[#F8910C] transition-colors flex-shrink-0">
            <Bell size={15} />
          </button>
        </div>
      ) : (
        <div className="flex justify-center mb-3">
          <div className="w-9 h-9 rounded-full bg-[#405FFA] flex items-center justify-center text-white font-bold text-sm">
            U
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2.5 overflow-y-auto space-y-0.5">
        {menuItems.map(({ label, Icon, color, sub }) => (
          <div key={label}>
            <button
              onClick={() => {
                if (sub.length) setOpenMenu(openMenu === label ? null : label);
                else cambiarVista(label.toLowerCase());
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150 text-left group"
              style={{ color: "#12263A" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "rgba(18,38,58,0.05)"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <Icon size={17} style={{ color, flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {sub.length > 0 && (
                    <ChevronLeft
                      size={13}
                      style={{
                        color: "#668EA5",
                        transform: openMenu === label ? "rotate(-90deg)" : "rotate(-180deg)",
                        transition: "transform .2s",
                      }}
                    />
                  )}
                </>
              )}
            </button>
            {/* Submenú */}
            {!collapsed && openMenu === label && sub.length > 0 && (
              <div className="pl-9 pr-2 pb-1 space-y-0.5">
                {sub.map((s) => (
                  <button key={s}
                    className="w-full text-left text-[12px] text-[#668EA5] hover:text-[#12263A] px-2 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer: Configuración + Salir */}
      <div className="p-2.5 space-y-0.5" style={{ borderTop: "1px solid rgba(18,38,58,0.07)" }}>
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] text-[#668EA5] hover:bg-black/5 transition-colors">
          <Settings size={15} />
          {!collapsed && <span>Configuración</span>}
        </button>
        <button
          onClick={() => cambiarVista("casa")}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12px] text-[#F8910C] hover:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR PÚBLICO (landing, login, registro)
   ══════════════════════════════════════════════════════════════ */
export default function Sidebar({ vistaActual, cambiarVista }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (vistaActual === "dashboard") {
    return (
      <SidebarDashboard
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        cambiarVista={cambiarVista}
      />
    );
  }

  const navLinks = [
    { id: "casa",     label: "Casa",           Icon: Home     },
    { id: "login",    label: "Iniciar sesión",  Icon: LogIn    },
    { id: "registro", label: "Registrarse",     Icon: UserPlus },
    { id: "contacto", label: "Contáctanos",     Icon: Mail     },
  ];

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out h-screen relative"
      style={{
        width: collapsed ? "66px" : "240px",
        background: "#F4EDEA",
        borderRight: "1px solid rgba(18,38,58,0.08)",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 min-h-[60px]">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <BetaLogo size={30} />
            <div className="font-['Space_Grotesk'] text-[13px] font-bold text-[#12263A] leading-tight whitespace-nowrap">
              BETA
              <div className="text-[10px] font-normal text-[#668EA5]">Finanzas para jóvenes</div>
            </div>
          </div>
        )}
        {collapsed && <div className="mx-auto"><BetaLogo size={28} /></div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-black/5 text-[#668EA5] flex-shrink-0 transition-colors"
        >
          <ChevronLeft
            size={15}
            style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .3s" }}
          />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2.5 py-2 space-y-0.5">
        {navLinks.map(({ id, label, Icon }) => {
          const active = vistaActual === id;
          return (
            <div key={id} className="relative group">
              <button
                onClick={() => cambiarVista(id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                style={{
                  background: active ? "#405FFA" : "transparent",
                  color: active ? "white" : "#12263A",
                }}
                onMouseOver={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(18,38,58,0.05)";
                }}
                onMouseOut={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <Icon size={17} style={{ color: active ? "white" : "#668EA5", flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
              </button>
              {/* Tooltip colapsado */}
              {collapsed && (
                <span className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[11px] font-semibold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md"
                  style={{ background: "#12263A", color: "#FFFACB" }}>
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Ilustración sidebar ── */}
      {!collapsed ? (
        <div className="mx-3 mb-3 rounded-2xl overflow-hidden border border-black/5 shadow-sm"
          style={{ height: 160 }}>
          <SidebarIllu />
        </div>
      ) : (
        <div className="mx-1 mb-3 rounded-xl overflow-hidden bg-white/40 border border-black/5">
          <MiniIllu />
        </div>
      )}
    </aside>
  );
}