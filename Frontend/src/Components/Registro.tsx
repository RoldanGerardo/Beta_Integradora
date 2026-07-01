import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import BetaLogo from "./BetaLogo";

type Props = { onNavigate: (vista: string) => void };

function getPassStrength(pass: string): { label: string; pct: number; color: string } {
  if (pass.length === 0) return { label: "",          pct: 0,   color: "#e5e7eb" };
  if (pass.length < 6)   return { label: "Débil",     pct: 25,  color: "#F8910C" };
  if (pass.length < 10)  return { label: "Regular",   pct: 55,  color: "#FABE0B" };
  if (/[^a-zA-Z0-9]/.test(pass))
                         return { label: "Fuerte 💪", pct: 100, color: "#84D175" };
  return               { label: "Buena",      pct: 80,  color: "#26CBD1" };
}

export default function Registro({ onNavigate }: Props) {
  const [form, setForm]         = useState({ nombre: "", username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const passInfo = getPassStrength(form.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nombre || !form.username || !form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate("dashboard");
    }, 1200);
  };

  return (
    <div
      className="min-h-full w-full flex items-center justify-center p-6"
      style={{ background: "#F4EDEA" }}
    >
      <div
        className="flex w-full max-w-3xl rounded-3xl overflow-hidden shadow-lg"
        style={{ minHeight: 520 }}
      >

        <div
          className="hidden md:flex w-2/5 flex-col items-center justify-center relative overflow-hidden p-8"
          style={{ background: "linear-gradient(160deg, #E6FBDA 0%, #BDE2F2 100%)" }}
        >
       
          <div
            className="absolute left-[-30%] top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: "110%",
              paddingTop: "110%",
              border: "70px solid rgba(132,209,117,0.28)",
            }}
          />

          <div className="relative z-10 mb-5">
            <svg viewBox="0 0 120 120" fill="none" width="110" height="110">
              <circle cx="60" cy="60" r="54" fill="rgba(132,209,117,0.10)" stroke="rgba(132,209,117,0.25)" strokeWidth="1"/>
              {/* Cohete */}
              <path d="M60 85 L60 40" stroke="#405FFA" strokeWidth="2" strokeLinecap="round" opacity=".3"/>
              <path
                d="M60 32 C60 32 52 44 52 58 L60 62 L68 58 C68 44 60 32 60 32Z"
                fill="#405FFA"
              />
              <ellipse cx="60" cy="60" rx="8" ry="5" fill="#BDE2F2"/>
              {/* Llama */}
              <path d="M55 62 C55 68 57 72 60 74 C63 72 65 68 65 62Z" fill="#FABE0B" opacity=".9"/>
              <path d="M57 63 C57 67 58.5 70 60 71 C61.5 70 63 67 63 63Z" fill="#F8910C" opacity=".7"/>
              {/* Aletas */}
              <path d="M52 56 L46 64 L52 62Z" fill="#405FFA" opacity=".7"/>
              <path d="M68 56 L74 64 L68 62Z" fill="#405FFA" opacity=".7"/>
              {/* Estrellas */}
              <circle cx="38" cy="34" r="2.5" fill="#FABE0B" opacity=".8"/>
              <circle cx="84" cy="40" r="2" fill="#84D175" opacity=".8"/>
              <circle cx="80" cy="26" r="1.5" fill="#F8910C" opacity=".7"/>
              <circle cx="34" cy="50" r="1.5" fill="#405FFA" opacity=".6"/>
              <circle cx="88" cy="60" r="2" fill="#FABE0B" opacity=".5"/>
            </svg>
          </div>

          <div className="relative z-10 text-center space-y-3">
            <h3
              className="font-['Space_Grotesk'] text-[21px] font-bold"
              style={{ color: "#12263A" }}
            >
              Únete a BETA 🚀
            </h3>
            <p
              className="text-[13px] leading-relaxed"
              style={{ fontFamily: "'Inter',sans-serif", color: "#668EA5", maxWidth: 180 }}
            >
              Crea tu cuenta en segundos y empieza a hacer que el dinero trabaje para ti.
            </p>
           
            <div className="space-y-1.5 pt-1 text-left">
              {["100% gratuito","Sin conexión a bancos","Aprendizaje paso a paso"].map(b => (
                <div key={b} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#84D175" }}
                  >
                    <Check size={10} style={{ color: "white" }} />
                  </div>
                  <span className="text-[12px]" style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col justify-center p-8 lg:p-10"
          style={{ background: "white" }}
        >
          <div className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: "#FABE0B" }}
            >
              <BetaLogo size={30} />
            </div>
          </div>

          <h2
            className="font-['Space_Grotesk'] text-[22px] font-bold text-center mb-1"
            style={{ color: "#12263A" }}
          >
            Crear cuenta
          </h2>
          <p
            className="text-center text-[12px] mb-5"
            style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}
          >
            Es gratis y toma menos de un minuto
          </p>

          {error && (
            <div
              className="mb-4 px-4 py-2 rounded-xl text-[12px] font-medium"
              style={{
                background: "rgba(248,145,12,0.10)",
                color: "#AE6D21",
                border: "1px solid rgba(248,145,12,0.22)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "nombre",   type: "text", placeholder: "Nombre completo" },
                { key: "username", type: "text", placeholder: "Username"        },
              ].map(({ key, type, placeholder }) => (
                <div key={key}>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: "#668EA5" }}
                  >
                    {key === "nombre" ? "Nombre" : "Username"}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full py-1.5 text-[13px] bg-transparent outline-none transition-colors duration-150"
                    style={{
                      borderBottom: "2px solid rgba(18,38,58,0.15)",
                      color: "#12263A",
                      fontFamily: "'Inter',sans-serif",
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "#84D175"}
                    onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)"}
                  />
                </div>
              ))}
            </div>

            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "#668EA5" }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full py-1.5 text-[13px] bg-transparent outline-none transition-colors duration-150"
                style={{
                  borderBottom: "2px solid rgba(18,38,58,0.15)",
                  color: "#12263A",
                  fontFamily: "'Inter',sans-serif",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "#84D175"}
                onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)"}
              />
            </div>

            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "#668EA5" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full py-1.5 text-[13px] bg-transparent outline-none transition-colors duration-150 pr-8"
                  style={{
                    borderBottom: "2px solid rgba(18,38,58,0.15)",
                    color: "#12263A",
                    fontFamily: "'Inter',sans-serif",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "#84D175"}
                  onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(18,38,58,0.15)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#668EA5" }}
                >
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
             
              {form.password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(18,38,58,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${passInfo.pct}%`, background: passInfo.color }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: passInfo.color }}>
                    {passInfo.label}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-['Space_Grotesk'] font-bold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 mt-1"
              style={{
                background: loading ? "#668EA5" : "#12263A",
                color: loading ? "white" : "#FFFACB",
                opacity: loading ? .8 : 1,
              }}
            >
              {loading ? "Creando cuenta..." : <> CREAR CUENTA <ArrowRight size={16}/> </>}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }}/>
              <span className="text-[11px]" style={{ color: "#668EA5" }}>o</span>
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }}/>
            </div>

            <p
              className="text-center text-[12px]"
              style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}
            >
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-bold transition-colors"
                style={{ color: "#405FFA" }}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}