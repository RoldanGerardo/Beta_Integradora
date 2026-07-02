import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import BetaLogo from "./BetaLogo";
import { useAuth } from "../context/AuthContext";

type Props = { onNavigate: (vista: string) => void };

export default function Login({ onNavigate }: Props) {
  const { iniciarSesion } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const usuario = await iniciarSesion(form.email, form.password);
      // El acceso al panel admin depende únicamente del rol devuelto por el
      // backend: no hay ningún botón ni ruta visible de "Administrador".
      onNavigate(usuario.rol === "admin" ? "admin-dashboard" : "dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-full w-full flex items-center justify-center p-6"
      style={{ background: "#F4EDEA" }}
    >
      <div
        className="flex w-full max-w-3xl rounded-3xl overflow-hidden shadow-lg"
        style={{ minHeight: 480 }}
      >

        <div
          className="hidden md:flex w-2/5 flex-col items-center justify-center relative overflow-hidden p-8"
          style={{ background: "linear-gradient(160deg, #FFFACB 0%, #BDE2F2 100%)" }}
        >
        
          <div
            className="absolute left-[-30%] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: "110%",
              paddingTop: "110%",
              border: "70px solid rgba(64,95,250,0.20)",
            }}
          />

          <div className="relative z-10 mb-5">
            <svg viewBox="0 0 120 120" fill="none" width="110" height="110">
              {/* Fondo circular */}
              <circle cx="60" cy="60" r="54" fill="rgba(64,95,250,0.08)" stroke="rgba(64,95,250,0.18)" strokeWidth="1"/>
              <ellipse cx="60" cy="82" rx="22" ry="7" fill="#FABE0B" opacity=".9"/>
              <ellipse cx="60" cy="76" rx="22" ry="7" fill="#F8910C" opacity=".85"/>
              <ellipse cx="60" cy="70" rx="22" ry="7" fill="#FABE0B" opacity=".9"/>
              {/* Flecha hacia arriba */}
              <path d="M60 58 L60 32" stroke="#405FFA" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M50 42 L60 32 L70 42" stroke="#405FFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="36" cy="36" r="3" fill="#FABE0B" opacity=".7"/>
              <circle cx="86" cy="42" r="2" fill="#84D175" opacity=".7"/>
              <circle cx="82" cy="28" r="1.5" fill="#F8910C" opacity=".6"/>
              <circle cx="32" cy="52" r="2" fill="#405FFA" opacity=".5"/>
            </svg>
          </div>

          <div className="relative z-10 text-center space-y-3">
            <h3
              className="font-['Space_Grotesk'] text-[21px] font-bold"
              style={{ color: "#12263A" }}
            >
              ¡Hola de nuevo! 👋
            </h3>
            <p
              className="text-[13px] leading-relaxed"
              style={{ fontFamily: "'Inter',sans-serif", color: "#668EA5", maxWidth: 180 }}
            >
              Accede a tu simulador para seguir administrando tus finanzas y ver tu progreso.
            </p>

            <div className="flex gap-3 justify-center pt-1">
              {[["🎯","Meta activa"],["📈","Progreso guardado"]].map(([icon, lbl]) => (
                <div
                  key={lbl}
                  className="bg-white/60 rounded-xl px-3 py-2 text-center backdrop-blur-sm flex flex-col items-center gap-1"
                >
                  <span className="text-[18px]">{icon}</span>
                  <div className="text-[10px] font-semibold" style={{ color: "#668EA5" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center p-8 lg:p-10"
          style={{ background: "white" }}
        >
          <div className="flex justify-center mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: "#BDE2F2" }}
            >
              <BetaLogo size={32} />
            </div>
          </div>

          <h2
            className="font-['Space_Grotesk'] text-[22px] font-bold text-center mb-1"
            style={{ color: "#12263A" }}
          >
            Iniciar sesión
          </h2>
          <p
            className="text-center text-[12px] mb-6"
            style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}
          >
            Ingresa tus credenciales para continuar
          </p>

          {error && (
            <div
              className="mb-4 px-4 py-2 rounded-xl text-[12px] font-medium"
              style={{ background: "rgba(248,145,12,0.12)", color: "#AE6D21", border: "1px solid rgba(248,145,12,0.25)" }}
            >
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
                style={{ color: "#668EA5" }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150"
                style={{
                  borderBottom: "2px solid rgba(18,38,58,0.15)",
                  color: "#12263A",
                  fontFamily: "'Inter',sans-serif",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "#405FFA"}
                onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)"}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#668EA5" }}
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-[11px] font-semibold transition-colors"
                  style={{ color: "#405FFA" }}
                  onClick={() => {/* TODO: recuperar contraseña */}}
                >
                  ¿Olvidaste la tuya?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full py-2 text-[13px] bg-transparent outline-none transition-colors duration-150 pr-8"
                  style={{
                    borderBottom: "2px solid rgba(18,38,58,0.15)",
                    color: "#12263A",
                    fontFamily: "'Inter',sans-serif",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "#405FFA"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#668EA5" }}
                >
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-['Space_Grotesk'] font-bold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 mt-2"
              style={{
                background: loading ? "#668EA5" : "#FABE0B",
                color: "#12263A",
                opacity: loading ? .8 : 1,
              }}
            >
              {loading ? (
                "Verificando..."
              ) : (
                <>ENTRAR <ArrowRight size={16}/></>
              )}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }}/>
              <span className="text-[11px]" style={{ color: "#668EA5" }}>o</span>
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }}/>
            </div>

            <p
              className="text-center text-[12px]"
              style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}
            >
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => onNavigate("registro")}
                className="font-bold transition-colors"
                style={{ color: "#405FFA" }}
              >
                Regístrate gratis
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}