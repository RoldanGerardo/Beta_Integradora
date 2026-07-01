/* ─────────────────────────────────────────────────
   src/App.tsx
   ───────────────────────────────────────────────── */
import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import Registro from "./Components/Registro";
import Login from "./Components/Login";
import MovimientosManager from "./Components/MovimientosManager";

export default function App() {
  const [vista, setVista] = useState<string>("casa");

  const renderVista = () => {
    switch (vista) {
      case "casa": return <LandingPage onNavigate={setVista} />;
      case "dashboard": return <Dashboard onNavigate={setVista} />;
      case "registro": return <Registro onNavigate={setVista} />;
      case "login": return <Login onNavigate={setVista} />;

      // 🔥 RUTAS SEGÚN EL SUBMENÚ DEL SIDEBAR 🔥
      case "ingresos": return <MovimientosManager tipoVista="ingresos" onNavigate={setVista} />;
      case "egresos": return <MovimientosManager tipoVista="egresos" onNavigate={setVista} />;
      case "balance": return <MovimientosManager tipoVista="balance" onNavigate={setVista} />;

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
            <span className="text-4xl">🚧</span>
            <p className="text-[16px] font-semibold" style={{ color: "#12263A" }}>
              Vista <code className="bg-white px-2 py-0.5 rounded text-sm">{vista}</code> — próximamente
            </p>
            <button
              onClick={() => setVista("dashboard")}
              className="text-[13px] px-4 py-2 rounded-lg font-bold"
              style={{ background: "#FABE0B", color: "#12263A", border: "none", cursor: "pointer" }}
            >
              ← Volver al inicio
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar vistaActual={vista} cambiarVista={setVista} />
      {renderVista()}
    </div>
  );
}