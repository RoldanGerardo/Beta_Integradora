import { useState } from "react";

type LandingPageProps = {
  onNavigate: (vista: string) => void;
};

function IcoEducacion() {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
      <rect x="10" y="6" width="26" height="33" rx="4" stroke="#12263A" strokeWidth="1.4" />
      <line x1="16" y1="14" x2="30" y2="14" stroke="#12263A" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="19" x2="30" y2="19" stroke="#668EA5" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="24" x2="24" y2="24" stroke="#668EA5" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
      <circle cx="35" cy="36" r="7" fill="#BDE2F2" stroke="#668EA5" strokeWidth="1.4" />
      <path d="M32 36h6M35 33v6" stroke="#12263A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IcoSimulador() {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
      <circle cx="24" cy="24" r="12" stroke="#AE6D21" strokeWidth="1.4" />
      <path d="M24 17v7l4 2.5" stroke="#AE6D21" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 9.5l2 3.5M31 9.5l-2 3.5" stroke="#FABE0B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="#FABE0B" />
      <path d="M12 36s3-3.5 12-3.5 12 3.5 12 3.5" stroke="#AE6D21" strokeWidth="1.1" strokeLinecap="round" opacity=".4" />
    </svg>
  );
}

function IcoReportes() {
  return (
    <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
      <rect x="8" y="30" width="7" height="10" rx="2" fill="#B3C56E" opacity=".6" />
      <rect x="19" y="22" width="7" height="18" rx="2" fill="#84D175" opacity=".75" />
      <rect x="30" y="14" width="7" height="26" rx="2" fill="#707D4E" opacity=".85" />
      <polyline
        points="11,26 22,18 33,12 42,16"
        fill="none" stroke="#707D4E" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="11" cy="26" r="2.5" fill="#84D175" />
      <circle cx="22" cy="18" r="2.5" fill="#84D175" />
      <circle cx="33" cy="12" r="2.5" fill="#707D4E" />
    </svg>
  );
}

function QuienesSomosIllu() {
  return (
    <svg viewBox="0 0 200 154" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="200" height="154" fill="#F4EDEA" />
      <circle cx="100" cy="60" r="36" fill="#BDE2F2" opacity=".5" stroke="#668EA5" strokeWidth="1" />
      <circle cx="58" cy="110" r="24" fill="#FFFACB" opacity=".8" stroke="#FABE0B" strokeWidth="1" />
      <circle cx="145" cy="112" r="19" fill="#E6FBDA" opacity=".8" stroke="#84D175" strokeWidth="1" />
      {/* Pajarito centrado */}
      <g transform="translate(88,44) scale(1.1)">
        <path d="M0 0 C-8 -5 -16 -3 -18 2 C-14 0 -10 1 -8 4 Z" fill="#405FFA" />
        <path d="M0 0 C-6 -2 -10 0 -8 4 Z" fill="#6B83FB" opacity=".7" />
        <circle cx="3" cy="-1" r="3" fill="#405FFA" />
        <path d="M5 -2 L8 -1 L5 0Z" fill="#12263A" />
      </g>
      <text x="100" y="68" textAnchor="middle" fill="#12263A"
        fontFamily="Space Grotesk,sans-serif" fontSize="9" fontWeight="600" opacity=".5">
        Simulador
      </text>
      <text x="58" y="107" textAnchor="middle" fill="#AE6D21"
        fontFamily="Space Grotesk,sans-serif" fontSize="11" fontWeight="700">ODS 4</text>
      <text x="58" y="120" textAnchor="middle" fill="#668EA5"
        fontFamily="Inter,sans-serif" fontSize="8">Calidad</text>
      <text x="145" y="109" textAnchor="middle" fill="#707D4E"
        fontFamily="Space Grotesk,sans-serif" fontSize="11" fontWeight="700">MX</text>
      <text x="145" y="121" textAnchor="middle" fill="#668EA5"
        fontFamily="Inter,sans-serif" fontSize="8">Enfoque</text>
    </svg>
  );
}

type OfferCircle = {
  Icono: () => JSX.Element;
  bg: string;
  border: string;
  title: string;
  titleColor: string;
  desc: string;
  badge?: string;
};

const offerData: OfferCircle[] = [
  {
    Icono: IcoEducacion,
    bg: "#BDE2F2",
    border: "#668EA5",
    title: "Módulo educativo",
    titleColor: "#12263A",
    desc: "Lecturas y cuestionarios sobre ahorro y finanzas básicas.",
    badge: "NUEVO",
  },
  {
    Icono: IcoSimulador,
    bg: "#FFFACB",
    border: "#FABE0B",
    title: "Simulador financiero",
    titleColor: "#AE6D21",
    desc: "Registra ingresos y egresos en tiempo real y ve tu balance.",
  },
  {
    Icono: IcoReportes,
    bg: "#E6FBDA",
    border: "#84D175",
    title: "Reportes mensuales",
    titleColor: "#707D4E",
    desc: "Analiza tus hábitos con reportes quincenales y mensuales.",
  },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [activeCircle, setActiveCircle] = useState<number | null>(null);

  return (
    <main className="flex-1 overflow-y-auto min-w-0" style={{ background: "#FFFACB" }}>

      <section
        className="px-10 pt-9 pb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(158deg, #FFFACB 0%, #FFF6E0 100%)" }}
      >
        <div className="absolute top-[-24px] right-[-20px] opacity-[.16] pointer-events-none">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            <circle cx="80" cy="80" r="78" stroke="#FABE0B" strokeWidth="1.5" />
            <circle cx="80" cy="80" r="55" stroke="#26CBD1" strokeWidth="1" />
            <circle cx="80" cy="80" r="32" stroke="#84D175" strokeWidth=".5" />
            <circle cx="80" cy="80" r="12" fill="#FABE0B" opacity=".3" />
          </svg>
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
          style={{ background: "rgba(250,190,11,0.15)", border: "1px solid rgba(250,190,11,0.35)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FABE0B" }} />
          <span className="text-[10px] font-semibold tracking-[.08em] uppercase" style={{ color: "#AE6D21" }}>
            Tu dinero, tu futuro
          </span>
        </div>

        <h1
          className="font-['Space_Grotesk'] font-bold leading-[1.18] mb-2.5"
          style={{ fontSize: "clamp(24px,4vw,32px)", color: "#12263A", maxWidth: 390 }}
        >
          Maneja tu dinero{" "}
          <em className="not-italic" style={{ color: "#26CBD1" }}>sin miedo</em>
        </h1>
        <p
          className="text-[13px] leading-[1.72] mb-5"
          style={{ color: "#668EA5", maxWidth: 310 }}
        >
          Registra ingresos, controla gastos y aprende finanzas con lecciones hechas para ti.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={() => onNavigate("registro")}
            className="px-5 py-2.5 rounded-[10px] text-[13px] font-bold font-['Space_Grotesk'] border-none cursor-pointer transition-colors duration-150"
            style={{ background: "#12263A", color: "#FFFACB" }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#26CBD1";
              (e.currentTarget as HTMLButtonElement).style.color = "#12263A";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#12263A";
              (e.currentTarget as HTMLButtonElement).style.color = "#FFFACB";
            }}
          >
            Registrarse
          </button>
          <button
            onClick={() => onNavigate("acerca")}
            className="px-5 py-2.5 rounded-[10px] text-[13px] cursor-pointer transition-colors duration-150"
            style={{
              background: "transparent",
              color: "#668EA5",
              border: "1px solid rgba(18,38,58,0.18)",
            }}
            onMouseOver={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "#26CBD1";
              b.style.color = "#12263A";
            }}
            onMouseOut={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = "rgba(18,38,58,0.18)";
              b.style.color = "#668EA5";
            }}
          >
            Explorar →
          </button>
        </div>
      </section>

      <div style={{ height: 1, margin: "0 40px", background: "rgba(18,38,58,0.08)" }} />

      <section
        className="px-10 py-8 grid gap-6 items-center"
        style={{ gridTemplateColumns: "1fr 1fr", background: "#FFFACB" }}
      >
        <div>
          <p className="text-[10px] font-semibold tracking-[.10em] uppercase mb-2" style={{ color: "#AE6D21" }}>
            Quiénes somos
          </p>
          <h2
            className="font-['Space_Grotesk'] font-bold text-[20px] mb-2 leading-snug"
            style={{ color: "#12263A" }}
          >
            Educación financiera accesible
          </h2>
          <p className="text-[13px] leading-[1.72] mb-4" style={{ color: "#668EA5" }}>
            Somos estudiantes de la UT Cancún que creen que aprender a administrar el dinero
            no debe ser difícil. BETA nació para demostrarlo.
          </p>
          <div className="flex gap-2.5">
            {[
              { n: "16–20", l: "Edad objetivo",       bg: "rgba(189,226,242,0.55)", border: "rgba(102,142,165,0.25)", nc: "#12263A" },
              { n: "ODS 4", l: "Educación de calidad", bg: "rgba(132,209,117,0.20)",  border: "rgba(112,125,78,0.22)",  nc: "#707D4E" },
            ].map((s) => (
              <div
                key={s.n}
                className="flex-1 rounded-xl px-3.5 py-3"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div className="font-['Space_Grotesk'] text-[17px] font-bold mb-0.5" style={{ color: s.nc }}>
                  {s.n}
                </div>
                <div className="text-[10px]" style={{ color: "#668EA5" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(18,38,58,0.08)", minHeight: 150 }}
        >
          <QuienesSomosIllu />
        </div>
      </section>

      <div style={{ height: 1, margin: "0 40px", background: "rgba(18,38,58,0.08)" }} />

      <section className="px-10 py-8" style={{ background: "#F4EDEA" }}>
        <p className="text-[10px] font-semibold tracking-[.10em] uppercase mb-2" style={{ color: "#AE6D21" }}>
          Qué ofrecemos
        </p>
        <h2 className="font-['Space_Grotesk'] font-bold text-[20px] mb-6 leading-snug" style={{ color: "#12263A" }}>
          Todo en un solo lugar
        </h2>
        <div className="flex gap-5 justify-center">
          {offerData.map(({ Icono, bg, border, title, titleColor, desc, badge }, idx) => {
            const isActive = activeCircle === idx;
            return (
              <div
                key={title}
                className="flex flex-col items-center gap-3 flex-1 cursor-pointer"
                style={{ maxWidth: 150 }}
                onClick={() => setActiveCircle(isActive ? null : idx)}
              >
                <div
                  className="relative flex items-center justify-center rounded-full transition-transform duration-200"
                  style={{
                    width: 104,
                    height: 104,
                    background: bg,
                    border: `2px solid ${border}`,
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                  }}
                >
                  {badge && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full font-['Space_Grotesk']"
                      style={{ background: "#F8910C", color: "#fff" }}
                    >
                      {badge}
                    </span>
                  )}
                  <Icono />
                </div>
                <div
                  className="font-['Space_Grotesk'] text-[13px] font-semibold text-center"
                  style={{ color: titleColor }}
                >
                  {title}
                </div>
                <p className="text-[11px] text-center leading-[1.65]" style={{ color: "#668EA5" }}>
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="px-10 py-6 flex items-center gap-5 flex-wrap"
        style={{ background: "#BDE2F2", borderTop: "1px solid rgba(102,142,165,0.22)" }}
      >
        <div
          className="w-[58px] h-[58px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#FABE0B", border: "2px solid #AE6D21" }}
        >
          <svg viewBox="0 0 36 36" fill="none" width="36" height="36">
            <path
              d="M18 3L22 13L33 13L24 20L27 31L18 24L9 31L12 20L3 13L14 13Z"
              fill="#12263A" opacity=".15"
              stroke="#12263A" strokeWidth="1.2" strokeLinejoin="round"
            />
            <circle cx="18" cy="18" r="5" fill="#12263A" opacity=".7" />
            <circle cx="18" cy="18" r="2.5" fill="#FFFACB" />
          </svg>
        </div>

        <div className="flex-1 min-w-[150px]">
          <div className="font-['Space_Grotesk'] font-bold text-[17px] mb-1" style={{ color: "#12263A" }}>
            ¿Listo para tomar el control?
          </div>
          <p className="text-[12px] leading-[1.6]" style={{ color: "#668EA5" }}>
            Únete a BETA. Sin bancos reales, sin riesgo — solo aprendizaje real.
          </p>
        </div>

        <button
          onClick={() => onNavigate("registro")}
          className="flex-shrink-0 px-6 py-3 rounded-[10px] text-[13px] font-bold font-['Space_Grotesk'] border-none cursor-pointer whitespace-nowrap transition-colors duration-150"
          style={{ background: "#12263A", color: "#FFFACB" }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#26CBD1";
            (e.currentTarget as HTMLButtonElement).style.color = "#12263A";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#12263A";
            (e.currentTarget as HTMLButtonElement).style.color = "#FFFACB";
          }}
        >
          Registrarse o acceder →
        </button>
      </section>
    </main>
  );
}