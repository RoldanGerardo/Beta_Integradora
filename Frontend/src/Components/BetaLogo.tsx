/* ─────────────────────────────────────────────────
   src/Components/BetaLogo.tsx
   Logo oficial BETA — pájaro azul + letra B + diamante
   Reemplaza este SVG con el PNG/SVG real cuando esté listo:
     <img src="/assets/logo-beta.png" alt="BETA" width={size} />
   ───────────────────────────────────────────────── */

type Props = {
  size?: number;
};

export default function BetaLogo({ size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo BETA"
      role="img"
    >
      {/* Ala del pájaro */}
      <path
        d="M5 22 C5 14 10 8 18 10 C14 12 12 16 13 20 Z"
        fill="#405FFA"
      />
      <path
        d="M5 22 C7 18 10 15 14 14 C13 17 12 20 13 22 Z"
        fill="#6B83FB"
        opacity=".7"
      />
      {/* Cuerpo del pájaro */}
      <path
        d="M13 20 C15 17 19 15 22 17 C22 20 20 23 17 24 C15 24 13 22 13 20Z"
        fill="#405FFA"
      />
      {/* Cabeza */}
      <circle cx="22" cy="16" r="4" fill="#405FFA" />
      {/* Pico */}
      <path d="M25 15 L28 16 L25 17 Z" fill="#12263A" />
      {/* Letra B */}
      <path
        d="M14 23 L14 31 C16 31 20 31 20 29 C20 27.5 18.5 27 17 27
           C18.5 27 20 26.5 20 25 C20 23 16 23 14 23Z"
        fill="#12263A"
      />
      {/* Diamante */}
      <polygon points="26,8 29,11 26,14 23,11" fill="#888" opacity=".7" />
      <polygon points="26,8 29,11 26,11" fill="#aaa" opacity=".8" />
      <polygon points="26,14 23,11 29,11" fill="#666" opacity=".6" />
      <line x1="23" y1="11" x2="29" y2="11" stroke="#555" strokeWidth=".5" />
    </svg>
  );
}