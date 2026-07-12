import { ReactNode, ElementType } from "react";
import { C } from "./theme.ts";

/* ════════════════════════════════════════════════════════════
   Mascota BETO y demás ilustraciones/decoraciones reutilizables
   del diseño definitivo. Se centralizan aquí porque se usan en
   más de una pantalla (LandingPage, Login, Registro, Dashboard,
   AcercaDe, ProximamenteVista, etc.).
   ════════════════════════════════════════════════════════════ */

type BetoProps = {
  size?: number;
  mood?: "wave" | "cheer";
};

export function Beto({ size = 150, mood = "wave" }: BetoProps) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} style={{ animation: "betoBob 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="coinGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFE985" />
          <stop offset="55%" stopColor={C.sun} />
          <stop offset="100%" stopColor="#E29A00" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="148" rx="34" ry="7" fill={C.navy} opacity=".12" />
      <circle cx="80" cy="80" r="58" fill="url(#coinGrad)" stroke={C.navy} strokeWidth="4" />
      <circle cx="80" cy="80" r="47" fill="none" stroke="#FFF3C4" strokeWidth="2.5" strokeDasharray="4 6" opacity=".7" />
      <text x="80" y="70" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontSize="15" fontWeight="800" fill={C.navy} opacity=".55">$</text>
      <circle cx="56" cy="92" r="7" fill={C.mandarin} opacity=".45" />
      <circle cx="104" cy="92" r="7" fill={C.mandarin} opacity=".45" />
      <circle cx="62" cy="82" r="5.5" fill={C.navy} />
      <circle cx="98" cy="82" r="5.5" fill={C.navy} />
      <circle cx="64" cy="80" r="1.6" fill="white" />
      <circle cx="100" cy="80" r="1.6" fill="white" />
      <path d="M62 98 Q80 112 98 98" stroke={C.navy} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="58" cy="52" rx="12" ry="7" fill="white" opacity=".5" transform="rotate(-25 58 52)" />
      {mood === "wave" ? (
        <g style={{ transformOrigin: "118px 70px", animation: "wave 1.6s ease-in-out infinite" }}>
          <ellipse cx="122" cy="60" rx="9" ry="15" fill={C.sun} stroke={C.navy} strokeWidth="3" transform="rotate(20 122 60)" />
        </g>
      ) : (
        <>
          <ellipse cx="30" cy="50" rx="8" ry="13" fill={C.sun} stroke={C.navy} strokeWidth="3" transform="rotate(-35 30 50)" />
          <ellipse cx="130" cy="50" rx="8" ry="13" fill={C.sun} stroke={C.navy} strokeWidth="3" transform="rotate(35 130 50)" />
        </>
      )}
    </svg>
  );
}

/* Versión reducida de Beto — usada en Login y Registro */
export function BetoMini() {
  return (
    <svg viewBox="0 0 140 140" width="120" height="120" style={{ animation: "betoBob 3s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="coinLogin" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFE985" /><stop offset="55%" stopColor={C.sun} /><stop offset="100%" stopColor="#E29A00" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="128" rx="30" ry="6" fill={C.navy} opacity=".12" />
      <circle cx="70" cy="68" r="50" fill="url(#coinLogin)" stroke={C.navy} strokeWidth="4" />
      <circle cx="49" cy="78" r="6" fill={C.mandarin} opacity=".45" /><circle cx="91" cy="78" r="6" fill={C.mandarin} opacity=".45" />
      <circle cx="55" cy="65" r="5" fill={C.navy} /><circle cx="85" cy="65" r="5" fill={C.navy} />
      <circle cx="57" cy="63" r="1.4" fill="white" /><circle cx="87" cy="63" r="1.4" fill="white" />
      <path d="M55 82 Q70 94 85 82" stroke={C.navy} strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* Beto disfrazado de cohete — usado en Registro */
export function CohetitoBeto() {
  return (
    <svg viewBox="0 0 130 150" width="110" height="126" style={{ animation: "float1 3.2s ease-in-out infinite" }}>
      <ellipse cx="65" cy="140" rx="26" ry="6" fill={C.navy} opacity=".12" />
      <path d="M65 30 C65 30 45 55 45 88 L65 96 L85 88 C85 55 65 30 65 30Z" fill={C.blue} stroke={C.navy} strokeWidth="3" />
      <ellipse cx="65" cy="80" rx="12" ry="8" fill="#DCEBFB" stroke={C.navy} strokeWidth="2" />
      <path d="M53 90 C53 100 57 108 65 112 C73 108 77 100 77 90Z" fill={C.sun} stroke={C.navy} strokeWidth="2.5" />
      <path d="M43 78 L28 96 L43 92Z" fill={C.blue} stroke={C.navy} strokeWidth="2" />
      <path d="M87 78 L102 96 L87 92Z" fill={C.blue} stroke={C.navy} strokeWidth="2" />
      <circle cx="30" cy="40" r="3" fill={C.sun} /><circle cx="100" cy="50" r="2.4" fill={C.moss} /><circle cx="95" cy="28" r="2" fill={C.mandarin} />
    </svg>
  );
}

/* Moneda pequeña animada — usada en el header del Dashboard */
export function BetoDashboard() {
  return (
    <svg viewBox="0 0 100 100" width="46" height="46">
      <defs><radialGradient id="coinDash" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#FFE985" /><stop offset="55%" stopColor={C.sun} /><stop offset="100%" stopColor="#E29A00" /></radialGradient></defs>
      <circle cx="50" cy="50" r="38" fill="url(#coinDash)" stroke={C.navy} strokeWidth="3" />
      <circle cx="38" cy="58" r="4.5" fill={C.mandarin} opacity=".4" /><circle cx="62" cy="58" r="4.5" fill={C.mandarin} opacity=".4" />
      <circle cx="41" cy="48" r="3.6" fill={C.navy} /><circle cx="59" cy="48" r="3.6" fill={C.navy} />
      <path d="M40 62 Q50 70 60 62" stroke={C.navy} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type OlaProps = {
  fill: string;
  flip?: boolean;
};

/* Ola decorativa que separa secciones */
export function Ola({ fill, flip = false }: OlaProps) {
  return (
    <div className="w-full overflow-hidden leading-none relative z-10" style={{ marginBottom: -2, transform: flip ? "scaleX(-1)" : undefined }}>
      <svg viewBox="0 0 1440 90" className="w-full block" style={{ height: 64 }} preserveAspectRatio="none">
        <path fill={fill} d="M0,32 C240,80 480,0 720,26 C960,52 1200,8 1440,40 L1440,90 L0,90 Z" />
      </svg>
    </div>
  );
}

type StickerProps = {
  children: ReactNode;
  bg: string;
  rotate?: number;
};

/* Etiqueta tipo "sticker" rotada — usada como acento decorativo */
export function Sticker({ children, bg, rotate = -6 }: StickerProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-['Space_Grotesk'] font-bold text-[11px] uppercase tracking-wide"
      style={{ background: bg, color: C.navy, border: `2.5px dashed ${C.navy}30`, transform: `rotate(${rotate}deg)`, boxShadow: "0 4px 0 rgba(15,33,56,0.12)" }}
    >
      {children}
    </div>
  );
}

type RingProgressProps = {
  value?: number;
  color: string;
  track?: string;
  size?: number;
  stroke?: number;
  children?: ReactNode;
};

/* Anillo de progreso circular reutilizable */
export function RingProgress({ value = 60, color, track = "rgba(15,33,56,0.10)", size = 60, stroke = 6, children }: RingProgressProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      {children}
    </div>
  );
}

type SparklineProps = {
  data: number[];
  color: string;
  width?: number;
  height?: number;
};

/* Mini gráfica de tendencia — usada en las tarjetas del Dashboard */
export function Sparkline({ data, color, width = 100, height = 30 }: SparklineProps) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
      <polygon points={areaPoints} fill={color} opacity="0.14" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * step} cy={height - ((v - min) / range) * height} r={i === data.length - 1 ? 3 : 0} fill={color} />
      ))}
    </svg>
  );
}

type PatternDotsProps = {
  color?: string;
  opacity?: number;
  size?: number;
};

/* Patrón de puntos decorativo usado como fondo de tarjetas */
export function PatternDots({ color = "#12263A", opacity = 0.5, size = 16 }: PatternDotsProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: `radial-gradient(${color} 1.4px, transparent 1.4px)`, backgroundSize: `${size}px ${size}px`, opacity }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   Piezas nuevas, añadidas para la reconstrucción visual del
   Dashboard de usuario. No reemplazan nada de lo anterior.
   ════════════════════════════════════════════════════════════ */

type BetoCoinHeroProps = {
  size?: number;
};

/* Beto "de cuerpo entero" asomándose desde abajo — pensado para
   vivir sentado sobre el anillo de progreso de la tarjeta hero
   del Dashboard, como si celebrara la meta de ahorro. */
export function BetoCoinHero({ size = 92 }: BetoCoinHeroProps) {
  return (
    <svg viewBox="0 0 140 130" width={size} height={size * (130 / 140)} style={{ animation: "coinFloat 3.4s ease-in-out infinite" }}>
      <defs>
        <radialGradient id="coinHeroGrad" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#FFE985" />
          <stop offset="55%" stopColor={C.sun} />
          <stop offset="100%" stopColor={C.sunDeep} />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="118" rx="40" ry="8" fill={C.navy} opacity=".1" />
      <circle cx="70" cy="62" r="52" fill="url(#coinHeroGrad)" stroke={C.navy} strokeWidth="4" />
      <circle cx="70" cy="62" r="42" fill="none" stroke="#FFF3C4" strokeWidth="2.5" strokeDasharray="4 6" opacity=".65" />
      <circle cx="48" cy="72" r="6.5" fill={C.mandarin} opacity=".45" />
      <circle cx="92" cy="72" r="6.5" fill={C.mandarin} opacity=".45" />
      <circle cx="54" cy="60" r="5.2" fill={C.navy} />
      <circle cx="86" cy="60" r="5.2" fill={C.navy} />
      <circle cx="56" cy="58" r="1.5" fill="white" />
      <circle cx="88" cy="58" r="1.5" fill="white" />
      <path d="M54 76 Q70 88 86 76" stroke={C.navy} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="52" cy="38" rx="10" ry="6" fill="white" opacity=".5" transform="rotate(-25 52 38)" />
      <g style={{ transformOrigin: "104px 52px", animation: "wave 1.6s ease-in-out infinite" }}>
        <ellipse cx="106" cy="44" rx="8" ry="13" fill={C.sun} stroke={C.navy} strokeWidth="2.5" transform="rotate(20 106 44)" />
      </g>
    </svg>
  );
}

/* Monedas flotando en el fondo del Dashboard — capa decorativa de
   profundidad, sutil, siempre detrás del contenido (pointer-events: none). */
export function FloatingCoins() {
  const coins = [
    { top: "6%", left: "3%", size: 22, color: C.sun, delay: "0s", dur: "7s" },
    { top: "18%", left: "92%", size: 16, color: C.turquoise, delay: "0.6s", dur: "8.5s" },
    { top: "68%", left: "1%", size: 18, color: C.mandarin, delay: "1.1s", dur: "6.5s" },
    { top: "82%", left: "95%", size: 26, color: C.blue, delay: "0.3s", dur: "9s" },
    { top: "42%", left: "97%", size: 12, color: C.moss, delay: "1.6s", dur: "7.5s" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {coins.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle at 35% 30%, ${c.color}55, ${c.color}22 60%, transparent 70%)`,
            border: `2px solid ${c.color}33`,
            animation: `coinDrift ${c.dur} ease-in-out ${c.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

type CoinNodeProps = {
  Icon: ElementType;
  color: string;
  bg: string;
};

/* Nodo circular tipo "moneda" usado en la línea de tiempo de
   movimientos recientes del Dashboard. */
export function CoinNode({ Icon, color, bg }: CoinNodeProps) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 relative z-10"
      style={{ background: bg, borderColor: color, boxShadow: `0 2px 0 ${color}55` }}
    >
      <Icon size={17} color={color} />
    </div>
  );
}