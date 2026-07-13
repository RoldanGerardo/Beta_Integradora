import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import BetaLogo from "./BetaLogo";
import { CohetitoBeto } from "./Ilustraciones";
import { C } from "./theme.ts";
import type { CSSProperties, FormEvent } from "react";

type Props = { onNavigate: (vista: string) => void };

function getPassStrength(pass: string): { label: string; pct: number; color: string } {
  if (pass.length === 0) return { label: "", pct: 0, color: "#e5e7eb" };
  if (pass.length < 6) return { label: "Débil", pct: 25, color: "#F8910C" };
  if (pass.length < 10) return { label: "Regular", pct: 55, color: "#FABE0B" };
  if (/[^a-zA-Z0-9]/.test(pass)) return { label: "Fuerte 💪", pct: 100, color: "#84D175" };
  return { label: "Buena", pct: 80, color: "#26CBD1" };
}

export default function Registro({ onNavigate }: Props) {
  const [form, setForm] = useState({ nombre: "", username: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passInfo = getPassStrength(form.password);

  const handleSubmit = (e: FormEvent) => {
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
    }, 1000);
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 relative overflow-hidden" style={{ background: C.cream }}>
      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        .gummy3 { box-shadow: 0 6px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy3:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--g,#12263A); }
        .gummy3:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g,#12263A); }
      `}</style>
      <div className="absolute top-14 right-16 w-44 h-44 rounded-full pointer-events-none" style={{ background: C.moss, opacity: .14 }} />
      <div className="absolute bottom-8 left-10 w-36 h-36 rounded-full pointer-events-none" style={{ background: C.blue, opacity: .10 }} />

      <div className="flex w-full max-w-3xl rounded-[32px] overflow-hidden relative z-10" style={{ minHeight: 520, boxShadow: "0 20px 50px rgba(15,33,56,0.15)" }}>
        <div className="hidden md:flex w-2/5 flex-col items-center justify-center relative overflow-hidden p-8" style={{ background: "linear-gradient(160deg, #E4F7E1 0%, #DCEBFB 100%)" }}>
          <div className="relative z-10 mb-4"><CohetitoBeto /></div>
          <div className="relative z-10 text-center space-y-3">
            <h3 className="font-['Space_Grotesk'] text-[20px] font-extrabold" style={{ color: C.navy }}>Únete a BETA 🚀</h3>
            <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'Inter',sans-serif", color: C.navySoft, maxWidth: 190 }}>
              Crea tu cuenta en segundos y empieza a subir de nivel con tu dinero.
            </p>
            <div className="space-y-1.5 pt-1 text-left">
              {["100% gratuito", "Sin conexión a bancos", "Aprendizaje paso a paso"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.moss, width: 18, height: 18 }}>
                    <Check size={10} color="white" />
                  </div>
                  <span className="text-[12px]" style={{ color: C.navy, fontFamily: "'Inter',sans-serif" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-10" style={{ background: "white" }}>
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.sun, boxShadow: `0 5px 0 ${C.mandarin}55` }}>
              <BetaLogo size={30} />
            </div>
          </div>

          <h2 className="font-['Space_Grotesk'] text-[22px] font-extrabold text-center mb-1" style={{ color: C.navy }}>Crear cuenta</h2>
          <p className="text-center text-[12px] mb-5" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>Es gratis y toma menos de un minuto</p>

          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-2xl text-[12px] font-medium border-2" style={{ background: "rgba(248,145,12,0.08)", color: "#AE6D21", borderColor: "rgba(248,145,12,0.22)" }}>
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "nombre" as const, type: "text", placeholder: "Nombre completo", label: "Nombre" },
                { key: "username" as const, type: "text", placeholder: "Username", label: "Username" },
              ].map(({ key, type, placeholder, label }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.slate }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-colors duration-150"
                    style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.moss)}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.slate }}>Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-colors duration-150"
                style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.moss)}
                onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.slate }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] bg-transparent outline-none rounded-xl border-2 transition-colors duration-150 pr-9"
                  style={{ borderColor: "rgba(18,38,58,0.12)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = C.moss)}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(18,38,58,0.12)")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: C.slate }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(18,38,58,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${passInfo.pct}%`, background: passInfo.color }} />
                  </div>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: passInfo.color }}>{passInfo.label}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gummy3 w-full py-3 rounded-2xl font-['Space_Grotesk'] font-extrabold text-[13px] flex items-center justify-center gap-2 border-2 mt-1"
              style={{ background: loading ? C.slate : C.moss, color: loading ? "white" : C.navy, borderColor: C.navy, opacity: loading ? .85 : 1, "--g": C.navy } as CSSProperties}
            >
              {loading ? "Creando cuenta..." : <>CREAR CUENTA <ArrowRight size={16} /></>}
            </button>

            <p className="text-center text-[12px]" style={{ color: C.slate, fontFamily: "'Inter',sans-serif" }}>
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={() => onNavigate("login")} className="font-bold transition-colors" style={{ color: C.blue }}>
                Inicia sesión
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}