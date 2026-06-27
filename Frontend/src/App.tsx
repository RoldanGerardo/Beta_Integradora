/* ─────────────────────────────────────────────────
   src/App.tsx
   Layout raíz de BETA:
     - Sidebar fijo a la izquierda (desplegable)
     - Área principal dinámica (renderiza la vista activa)

   Para agregar una nueva vista:
     1. Crea el componente en src/Components/
     2. Importalo aquí
     3. Añade su case en renderVista()
   ───────────────────────────────────────────────── */
import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";

// Futuras vistas — descomenta cuando las crees:
// import About    from "./Components/About";
// import Contacto from "./Components/Contacto";
// import Registro from "./Components/Registro";
// import Login    from "./Components/Login";
// import Dashboard from "./Components/Dashboard";

export default function App() {
  const [vista, setVista] = useState<string>("casa");

  const renderVista = () => {
    switch (vista) {
      case "casa":
        return <LandingPage onNavigate={setVista} />;

      // case "acerca":
      //   return <About />;
      // case "contacto":
      //   return <Contacto />;
      // case "registro":
      //   return <Registro />;
      // case "dashboard":
      //   return <Dashboard />;

      default:
        return (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            style={{ background: "#FFFACB" }}
          >
            <span className="text-4xl">🚧</span>
            <p
              className="font-['Space_Grotesk'] text-[16px] font-semibold"
              style={{ color: "#12263A" }}
            >
              Vista <code className="text-[14px] bg-white px-2 py-0.5 rounded">{vista}</code> — próximamente
            </p>
            <button
              onClick={() => setVista("casa")}
              className="text-[13px] px-4 py-2 rounded-[8px] transition-colors duration-150"
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