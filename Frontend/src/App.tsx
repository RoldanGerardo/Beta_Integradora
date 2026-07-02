import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./Components/Sidebar";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard";
import Registro from "./Components/Registro";
import Login from "./Components/Login";
import MovimientosManager from "./Components/MovimientosManager";
import Reportes from "./Components/Reportes";
import AdminLayout from "./Components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsuarios from "./admin/pages/AdminUsuarios";

const VISTAS_ADMIN = ["admin-dashboard", "admin-usuarios", "admin-contenido", "admin-estadisticas", "admin-configuraciones"];

function AppInterno() {
  const [vista, setVista] = useState<string>("casa");
  const { isAdmin, cargando } = useAuth();

  if (cargando) return null; // evita parpadeo mientras se lee localStorage

  // Ruta protegida: si no es admin y llega (por estado/URL) a una vista
  // admin, se redirige silenciosamente al inicio.
  const vistaSegura = VISTAS_ADMIN.includes(vista) && !isAdmin ? "casa" : vista;

  if (VISTAS_ADMIN.includes(vistaSegura)) {
    const renderAdmin = () => {
      switch (vistaSegura) {
        case "admin-dashboard": return <AdminDashboard />;
        case "admin-usuarios": return <AdminUsuarios />;
        default:
          return (
            <div className="flex-1 flex items-center justify-center" style={{ background: "#FFFACB" }}>
              <p style={{ color: "#12263A" }}>Sección en construcción</p>
            </div>
          );
      }
    };
    return (
      <AdminLayout vistaActual={vistaSegura} cambiarVista={setVista}>
        {renderAdmin()}
      </AdminLayout>
    );
  }

  const renderVista = () => {
    switch (vista) {
      case "casa": return <LandingPage onNavigate={setVista} />;
      case "dashboard": return <Dashboard onNavigate={setVista} />;
      case "registro": return <Registro onNavigate={setVista} />;
      case "login": return <Login onNavigate={setVista} />;
      case "ingresos": return <MovimientosManager tipoVista="ingresos" onNavigate={setVista} />;
      case "egresos": return <MovimientosManager tipoVista="egresos" onNavigate={setVista} />;
      case "balance": return <MovimientosManager tipoVista="balance" onNavigate={setVista} />;
      case "reportes": return <Reportes onNavigate={setVista} />;
      case "quincenales": return <Reportes onNavigate={setVista} filtroInicial="quincenal" />;
      case "mensuales": return <Reportes onNavigate={setVista} filtroInicial="mensual" />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
            <span className="text-4xl">🚧</span>
            <p className="text-[16px] font-semibold" style={{ color: "#12263A" }}>
              Vista <code className="bg-white px-2 py-0.5 rounded text-sm">{vista}</code> — próximamente
            </p>
            <button onClick={() => setVista("dashboard")} className="text-[13px] px-4 py-2 rounded-lg font-bold" style={{ background: "#FABE0B", color: "#12263A", border: "none", cursor: "pointer" }}>
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

export default function App() {
  return (
    <AuthProvider>
      <AppInterno />
    </AuthProvider>
  );
}