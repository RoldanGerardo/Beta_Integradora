/* ─────────────────────────────────────────────────
   src/Components/Sidebar.tsx
   Sidebar desplegable:
     - Logo oficial (BetaLogo)
     - Ilustración SVG intercambiable (SidebarIllu)
     - Navegación con tooltip al colapsar
     - CTA "Crear cuenta"
   ───────────────────────────────────────────────── */
import { useState } from "react";
import { Home, Users, Mail, ChevronLeft, UserPlus } from "lucide-react";
import BetaLogo from "./BetaLogo";

type SidebarProps = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
};

const navLinks = [
  { id: "casa",     label: "Casa",        Icon: Home  },
  { id: "acerca",   label: "Acerca de",   Icon: Users },
  { id: "contacto", label: "Contáctanos", Icon: Mail  },
];

/* ── Ilustración del sidebar ──────────────────────────────────────
   Gráfica de barras colorida con pajarito BETA volando.
   Para reemplazar con una imagen real:
     <img src="/assets/sidebar-illu.png" alt="" className="w-full h-full object-cover" />
   ─────────────────────────────────────────────────────────────── */
function SidebarIllu() {
  return (
    <svg
      viewBox="0 0 240 192"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
      aria-hidden="true"
    >
      <rect width="240" height="192" fill="#F4EDEA" />
      {/* Cielo suave */}
      <rect width="240" height="100" fill="#BDE2F2" opacity=".22" />
      {/* Sol */}
      <circle cx="195" cy="38" r="22" fill="#FABE0B" opacity=".18" />
      <circle cx="195" cy="38" r="14" fill="#FABE0B" opacity=".32" />
      {/* Nubes */}
      <ellipse cx="55" cy="32" rx="22" ry="10" fill="white" opacity=".55" />
      <ellipse cx="72" cy="28" rx="16" ry="9" fill="white" opacity=".45" />
      <ellipse cx="155" cy="22" rx="18" ry="8" fill="white" opacity=".38" />
      {/* Barras (colores de la paleta BETA) */}
      {[
        { x: 36,  h: 52, y: 110, color: "#BDE2F2" },
        { x: 62,  h: 66, y: 96,  color: "#FABE0B" },
        { x: 88,  h: 80, y: 82,  color: "#26CBD1" },
        { x: 114, h: 62, y: 100, color: "#84D175" },
        { x: 140, h: 88, y: 74,  color: "#F8910C" },
        { x: 166, h: 72, y: 90,  color: "#668EA5" },
        { x: 192, h: 54, y: 108, color: "#FABE0B" },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="18" height={b.h} rx="4" fill={b.color} />
      ))}
      {/* Línea base */}
      <line x1="28" y1="164" x2="218" y2="164" stroke="#12263A" strokeWidth="1" opacity=".10" />
      {/* Línea de tendencia */}
      <polyline
        points="45,128 71,106 97,90 123,110 149,82 175,98 201,115"
        fill="none" stroke="#F8910C" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" opacity=".65"
      />
      {/* Puntos de la línea */}
      {[
        [45,128],[71,106],[97,90],[123,110],[149,82],[175,98]
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#F8910C" />
      ))}
      {/* Pajarito BETA volando */}
      <g transform="translate(100,46) rotate(-12)">
        <path d="M0 0 C-8 -5 -16 -3 -18 2 C-14 0 -10 1 -8 4 Z" fill="#405FFA" />
        <path d="M0 0 C-6 -2 -10 0 -8 4 Z" fill="#6B83FB" opacity=".7" />
        <circle cx="3" cy="-1" r="3.5" fill="#405FFA" />
        <path d="M5 -2 L9 -1 L5 0Z" fill="#12263A" />
      </g>
      {/* Monedas flotantes */}
      <circle cx="68" cy="54" r="7" fill="#FABE0B" opacity=".70" />
      <text x="68" y="58" textAnchor="middle" fontSize="8" fontWeight="700" fill="#AE6D21">$</text>
      <circle cx="172" cy="44" r="5.5" fill="#84D175" opacity=".65" />
      <text x="172" y="48" textAnchor="middle" fontSize="7" fontWeight="700" fill="#707D4E">$</text>
      {/* Etiqueta inferior */}
      <rect x="76" y="170" width="88" height="16" rx="4" fill="#12263A" opacity=".05" />
      <text
        x="120" y="181" textAnchor="middle"
        fontFamily="Space Grotesk,sans-serif" fontSize="9" fontWeight="600"
        fill="#12263A" opacity=".40"
      >
        balance mensual
      </text>
    </svg>
  );
}

export default function Sidebar({ vistaActual, cambiarVista }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? "66px" : "240px",
        background: "#F4EDEA",
        borderRight: "1px solid rgba(18,38,58,0.08)",
      }}
    >
      {/* ── Header: Logo + toggle ── */}
      <div className="flex items-center gap-2 px-3 pt-3.5 pb-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden">
          <BetaLogo size={36} />
          <div
            className="overflow-hidden transition-all duration-300 whitespace-nowrap"
            style={{ maxWidth: collapsed ? 0 : 140, opacity: collapsed ? 0 : 1 }}
          >
            <div
              className="font-['Space_Grotesk'] text-[14px] font-bold tracking-tight leading-tight"
              style={{ color: "#12263A" }}
            >
              BETA
            </div>
            <div className="text-[10px]" style={{ color: "#668EA5" }}>
              Finanzas para jóvenes
            </div>
          </div>
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="flex-shrink-0 w-[26px] h-[26px] rounded-[7px] flex items-center justify-center transition-colors duration-150"
          style={{
            border: "1px solid rgba(18,38,58,0.12)",
            background: "rgba(18,38,58,0.04)",
            color: "#668EA5",
          }}
        >
          <ChevronLeft
            size={14}
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </button>
      </div>

      {/* ── Ilustración ── */}
      <div className="h-[192px] overflow-hidden flex-shrink-0">
        <SidebarIllu />
      </div>

      {/* ── Navegación ── */}
      <nav className="px-2.5 pt-2 flex-1">
        <div
          className="text-[10px] font-semibold tracking-[.10em] uppercase px-1 mb-1.5 overflow-hidden transition-all duration-300"
          style={{
            color: "#AE6D21",
            maxHeight: collapsed ? 0 : 18,
            opacity: collapsed ? 0 : 1,
          }}
        >
          Menú
        </div>
        <ul className="flex flex-col gap-0.5 list-none">
          {navLinks.map(({ id, label, Icon }) => {
            const active = vistaActual === id;
            return (
              <li key={id} className="relative group">
                <button
                  onClick={() => cambiarVista(id)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] transition-colors duration-150 text-left"
                  style={{
                    background: active ? "#BDE2F2" : "transparent",
                    border: `1px solid ${active ? "rgba(102,142,165,0.25)" : "transparent"}`,
                  }}
                >
                  <Icon
                    size={17}
                    style={{
                      color: active ? "#12263A" : "#668EA5",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
                    style={{
                      maxWidth: collapsed ? 0 : 130,
                      opacity: collapsed ? 0 : 1,
                      color: active ? "#12263A" : "#668EA5",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {label}
                  </span>
                </button>

                {/* Tooltip al estar colapsado */}
                {collapsed && (
                  <span
                    className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md text-[11px] font-semibold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50"
                    style={{
                      background: "#12263A",
                      color: "#FFFACB",
                    }}
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer CTA ── */}
      <div
        className="p-2.5"
        style={{ borderTop: "1px solid rgba(18,38,58,0.07)" }}
      >
        {collapsed ? (
          <button
            onClick={() => cambiarVista("registro")}
            aria-label="Crear cuenta"
            className="w-11 h-11 rounded-[10px] flex items-center justify-center mx-auto transition-colors duration-150"
            style={{ background: "#FABE0B" }}
          >
            <UserPlus size={18} style={{ color: "#12263A" }} />
          </button>
        ) : (
          <button
            onClick={() => cambiarVista("registro")}
            className="w-full py-2.5 rounded-[10px] text-[12px] font-bold font-['Space_Grotesk'] tracking-wide transition-colors duration-150"
            style={{ background: "#FABE0B", color: "#12263A", border: "none" }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#F8910C";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#FABE0B";
            }}
          >
            Crear cuenta
          </button>
        )}
      </div>
    </aside>
  );
}