import { useEffect, useState } from "react";
import { Users, UserCheck, Wallet, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { adminObtenerDashboard, DashboardStats } from "../../services/authApi";

export default function AdminDashboard() {
  const { token, usuario } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminObtenerDashboard(token)
      .then(setStats)
      .catch(() => setError("No se pudo cargar el dashboard."))
      .finally(() => setCargando(false));
  }, [token]);

  const tarjetas = [
    { label: "Usuarios totales", valor: stats?.totalUsuarios ?? 0, Icon: Users, bg: "#BDE2F2", color: "#12263A" },
    { label: "Usuarios activos", valor: stats?.usuariosActivos ?? 0, Icon: UserCheck, bg: "#E6FBDA", color: "#707D4E" },
    { label: "Movimientos totales", valor: stats?.totalMovimientos ?? 0, Icon: Wallet, bg: "#FFF3E0", color: "#AE6D21" },
  ];

  return (
    <div className="flex-1 min-h-screen p-8" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
      <h1 className="text-[22px] font-bold mb-1" style={{ color: "#12263A" }}>
        Bienvenido, {usuario?.nombre}
      </h1>
      <p className="text-[13px] mb-6" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
        Resumen general de la plataforma
      </p>

      {error && (
        <div className="rounded-xl p-3 mb-4 flex items-center gap-2 text-[12px] font-semibold" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {cargando ? (
        <div className="flex items-center gap-2 text-[13px]" style={{ color: "#668EA5" }}>
          <Loader2 size={18} className="animate-spin" /> Cargando estadísticas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {tarjetas.map(({ label, valor, Icon, bg, color }) => (
              <div key={label} className="rounded-2xl p-5 transition-transform duration-150 hover:-translate-y-1" style={{ background: bg }}>
                <Icon size={22} style={{ color }} />
                <div className="text-[26px] font-bold mt-3" style={{ color: "#12263A" }}>{valor}</div>
                <div className="text-[12px] font-medium" style={{ color }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(18,38,58,0.06)" }}>
            <h3 className="font-bold text-[15px] mb-4" style={{ color: "#12263A" }}>Actividad reciente</h3>
            <div className="space-y-2.5">
              {stats?.ultimosMovimientos.length === 0 && (
                <p className="text-[12px]" style={{ color: "#668EA5" }}>Sin movimientos aún.</p>
              )}
              {stats?.ultimosMovimientos.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#F4EDEA" }}>
                  <span className="text-[13px] font-medium" style={{ color: "#12263A" }}>{m.descripcion}</span>
                  <span className="text-[12px] font-bold" style={{ color: m.tipo === "ingreso" ? "#707D4E" : "#AE6D21" }}>
                    {m.tipo === "ingreso" ? "+" : "-"}${Number(m.monto || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}