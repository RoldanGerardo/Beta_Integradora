import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import BetaLogo from "./BetaLogo";
import { BetoMini } from "./Ilustraciones";
import { useAuth } from "../context/AuthContext";
import { C } from "./theme.ts";
import type { CSSProperties, FormEvent } from "react";

type Props = { onNavigate: (vista: string) => void };

export default function Login({ onNavigate }: Props) {
  const { iniciarSesion } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recuperar, setRecuperar] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
    <div className="min-h-full w-full flex items-center justify-center p-6 relative overflow-hidden" style={{ background: C.cream }}>
      <style>{`
        @keyframes betoBob { 0%,100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-8px) rotate(1.5deg); } }
        @keyframes popIn { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }
        .gummy2 { box-shadow: 0 6px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy2:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--g,#12263A); }
        .gummy2:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g,#12263A); }
      `}</style>
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: C.turquoise, opacity: .12 }} />
      <div className="absolute bottom-10 right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: C.sun, opacity: .14 }} />

      <div className="flex w-full max-w-3xl rounded-[32px] overflow-hidden relative z-10" style={{ minHeight: 480, boxShadow: "0 20px 50px rgba(15,33,56,0.15)" }}>
        <div className="hidden md:flex w-2/5 flex-col items-center justify-center relative overflow-hidden p-8" style={{ background: `linear-gradient(160deg, ${C.creamDeep} 0%, #DCEBFB 100%)` }}>
          <div className="relative z-10 mb-4"><BetoMini /></div>
          <div className="relative z-10 text-center space-y-3">
            <h3 className="font-['Space_Grotesk'] text-[20px] font-extrabold" style={{ color: C.navy }}>¡Hola de nuevo! 👋</h3>
            <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'Inter',sans-serif", color: C.navySoft, maxWidth: 190 }}>
              Entra a tu simulador para seguir subiendo de nivel en tus finanzas.
            </p>
            <div className="flex gap-3 justify-center pt-1">
              {[["🎯", "Meta activa"], ["📈", "Progreso guardado"]].map(([icon, lbl]) => (
                <div key={lbl} className="bg-white/70 rounded-2xl px-3 py-2 text-center flex flex-col items-center gap-1 border-2" style={{ borderColor: "rgba(64,95,250,0.15)" }}>
                  <span className="text-[18px]">{icon}</span>
                  <div className="text-[10px] font-bold" style={{ color: C.navySoft }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-10" style={{ background: "white" }}>
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: C.sun, boxShadow: `0 5px 0 ${C.mandarin}55` }}>
              <BetaLogo size={30} />
            </div>
          </div>

          <h2 className="font-['Space_Grotesk'] text-[22px] font-extrabold text-center mb-1" style={{ color: C.navy }}>Iniciar sesión</h2>
          <p className="text-center text-[12px] mb-6" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-2xl text-[12px] font-medium border-2" style={{ background: "rgba(248,145,12,0.10)", color: "#AE6D21", borderColor: "rgba(248,145,12,0.3)" }}>
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-2.5 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-colors duration-150"
                style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.blue)}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.slate }}>Contraseña</label>
                <button type="button" onClick={() => setRecuperar(true)} className="text-[11px] font-bold transition-colors hover:opacity-70" style={{ color: C.blue }}>
                  ¿Olvidaste la tuya?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full py-2.5 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-colors duration-150 pr-9"
                  style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.blue)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: C.slate }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gummy2 w-full py-3 rounded-2xl font-['Space_Grotesk'] font-extrabold text-[13px] flex items-center justify-center gap-2 border-2 mt-2"
              style={{ background: loading ? C.slate : C.sun, color: C.navy, borderColor: C.navy, opacity: loading ? .85 : 1, "--g": C.navy } as CSSProperties}
            >
              {loading ? "Verificando..." : <>ENTRAR <ArrowRight size={16} /></>}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }} />
              <Sparkles size={13} color={C.turquoise} />
              <div className="flex-1 h-px" style={{ background: "rgba(18,38,58,0.08)" }} />
            </div>

            <p className="text-center text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={() => onNavigate("registro")} className="font-bold transition-colors" style={{ color: C.blue }}>
                Regístrate gratis
              </button>
            </p>
          </form>
        </div>
      </div>

      {recuperar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,33,56,0.5)" }} onClick={() => setRecuperar(false)}>
          <div className="bg-white rounded-[28px] p-7 max-w-sm w-full border-2 text-center" style={{ borderColor: C.navy, animation: "popIn .2s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-3"><BetoMini /></div>
            <h3 className="font-['Space_Grotesk'] font-extrabold text-[16px] mb-2" style={{ color: C.navy }}>¿Perdiste tu contraseña?</h3>
            <p className="text-[12.5px] leading-[1.7] mb-5" style={{ color: C.navySoft, fontFamily: "'Inter',sans-serif" }}>
              Escríbenos a <strong style={{ color: C.navy }}>soporte@betafinanzas.mx</strong> desde el correo con el que te registraste
              y nuestro equipo te ayuda a recuperar el acceso en menos de 24 horas.
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setRecuperar(false)} className="px-4 py-2 rounded-full text-[12px] font-bold" style={{ background: "#F4F7FB", color: C.navy }}>Entendido</button>
              <button
                onClick={() => { setRecuperar(false); onNavigate("contacto"); }}
                className="gummy2 px-4 py-2 rounded-full text-[12px] font-extrabold border-2"
                style={{ background: C.blue, color: "white", borderColor: C.navy, "--g": C.navy } as CSSProperties}
              >
                Contactar soporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}