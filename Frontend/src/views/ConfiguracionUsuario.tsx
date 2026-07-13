import { useState, useRef, FormEvent, useEffect } from "react";
import { Settings, User, Mail, Lock, Camera, Check, Shield, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { C } from "../Components/theme.ts";
import { Sticker } from "../Components/Ilustraciones.tsx";
import { actualizarPerfilUsuario, actualizarPasswordUsuario } from "../services/perfilApi.ts";
import type { CSSProperties } from "react";

export default function ConfiguracionUsuario() {
  const { token, usuario } = useAuth();
  
  // Estados para la información del perfil
  const [formInfo, setFormInfo] = useState({ nombre: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para la contraseña
  const [formPass, setFormPass] = useState({ actual: "", nueva: "", confirmar: "" });
  const [passError, setPassError] = useState("");

  // Estados de carga y éxito
  const [guardandoInfo, setGuardandoInfo] = useState(false);
  const [infoExito, setInfoExito] = useState(false);
  const [guardandoPass, setGuardandoPass] = useState(false);
  const [passExito, setPassExito] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (usuario) {
      setFormInfo({ nombre: usuario.nombre || "", email: usuario.email || "" });
    }
  }, [usuario]);

  // Manejo de la foto de perfil
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  // Enviar formulario de perfil
  const handleGuardarInfo = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setGuardandoInfo(true);
    
    try {
      await actualizarPerfilUsuario(token, {
        nombre: formInfo.nombre,
        email: formInfo.email,
        avatar: avatarFile || undefined
      });
      setInfoExito(true);
      setTimeout(() => setInfoExito(false), 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setGuardandoInfo(false);
    }
  };

  // Enviar formulario de contraseña
  const handleGuardarPass = async (e: FormEvent) => {
    e.preventDefault();
    setPassError("");
    
    if (formPass.nueva !== formPass.confirmar) {
      setPassError("Las contraseñas nuevas no coinciden.");
      return;
    }
    
    if (!token) return;
    setGuardandoPass(true);
    
    try {
      await actualizarPasswordUsuario(token, {
        passwordActual: formPass.actual,
        passwordNueva: formPass.nueva
      });
      setPassExito(true);
      setFormPass({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => setPassExito(false), 4000);
    } catch (error) {
      setPassError(error instanceof Error ? error.message : "Error al actualizar contraseña");
    } finally {
      setGuardandoPass(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto min-w-0 relative" style={{ background: C.cream }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes checkPop { 0% { transform: scale(.6); opacity:0; } 60% { transform: scale(1.15); opacity:1; } 100% { transform: scale(1); opacity:1; } }
        @keyframes gearSpin { to { transform: rotate(180deg); } }
        .gummy-btn { box-shadow: 0 6px 0 var(--g,#12263A); transition: transform .12s, box-shadow .12s; }
        .gummy-btn:hover { transform: translateY(-3px); box-shadow: 0 9px 0 var(--g,#12263A); }
        .gummy-btn:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--g,#12263A); }
        .avatar-hover-layer { opacity: 0; transition: opacity 0.2s ease; }
        .avatar-container:hover .avatar-hover-layer { opacity: 1; }
      `}</style>

      {/* Header de la sección */}
      <section className="relative overflow-hidden px-10 lg:px-16 pt-14 pb-10" style={{ background: `linear-gradient(170deg, ${C.creamDeep} 0%, ${C.cream} 60%)` }}>
        <Settings size={26} color={C.blue} className="absolute top-14 right-[15%] opacity-40" style={{ animation: "gearSpin 8s linear infinite" }} />
        <div className="relative z-10 max-w-4xl mx-auto" style={{ animation: "fadeInUp .5s ease-out both" }}>
          <div className="flex mb-4"><Sticker bg={C.blue} rotate={-2}>⚙️ Tu Espacio</Sticker></div>
          <h1 className="font-['Space_Grotesk'] font-extrabold leading-[1.1] mb-2" style={{ fontSize: "clamp(28px,4vw,38px)", color: C.navy }}>
            Configuración de Cuenta
          </h1>
          <p className="text-[14px] leading-[1.7]" style={{ color: C.navySoft, fontFamily: "'Inter',sans-serif" }}>
            Administra tus datos personales, foto de perfil y seguridad. Mantén tu cuenta al día para una mejor experiencia.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="px-10 lg:px-16 pb-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_2fr] gap-8">
          
          {/* Columna Izquierda: Tarjeta de Perfil Rápido */}
          <div className="flex flex-col gap-5" style={{ animation: "fadeInUp .5s ease-out .1s both" }}>
            <div className="bg-white rounded-[32px] p-8 border-[3px] flex flex-col items-center text-center" style={{ borderColor: C.navy }}>
              
              <div 
                className="avatar-container relative w-32 h-32 rounded-full mb-4 border-[3px] overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center" 
                style={{ borderColor: C.blue }}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Tu avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[40px] font-bold" style={{ color: C.blue }}>
                    {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                
                {/* Capa de Hover para cambiar foto */}
                <div className="avatar-hover-layer absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                  <Camera size={24} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cambiar</span>
                </div>
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
              />
              
              <h2 className="font-['Space_Grotesk'] font-extrabold text-[18px] truncate w-full" style={{ color: C.navy }}>
                {formInfo.nombre || "Tu Nombre"}
              </h2>
              <p className="text-[12px] font-medium mb-4 truncate w-full" style={{ color: C.slate }}>
                {formInfo.email || "tu@correo.com"}
              </p>

              <div className="w-full rounded-2xl p-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest" style={{ background: "rgba(64,95,250,0.1)", color: C.blue }}>
                <Shield size={14} /> 
                {usuario?.rol === "admin" ? "Administrador" : "Estudiante"}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formularios */}
          <div className="flex flex-col gap-8" style={{ animation: "fadeInUp .5s ease-out .2s both" }}>
            
            {/* Tarjeta Datos Personales */}
            <div className="bg-white rounded-[32px] p-8 border-[3px]" style={{ borderColor: C.navy }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#DCEBFB" }}>
                  <User size={18} color={C.blue} />
                </div>
                <h2 className="font-['Space_Grotesk'] font-extrabold text-[19px]" style={{ color: C.navy }}>Datos Personales</h2>
              </div>

              {infoExito && (
                <div className="mb-5 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-2" style={{ background: "rgba(132,209,117,0.18)", color: "#3D7A41", border: "1px solid rgba(132,209,117,0.4)", animation: "checkPop .35s ease-out" }}>
                  <Check size={16} /> ¡Tus datos han sido actualizados con éxito!
                </div>
              )}

              <form onSubmit={handleGuardarInfo} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Nombre completo</label>
                  <input
                    value={formInfo.nombre}
                    onChange={(e) => setFormInfo({ ...formInfo, nombre: e.target.value })}
                    className="w-full py-2.5 text-[14px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => (e.target.style.borderBottomColor = C.blue)}
                    onBlur={(e) => (e.target.style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Correo electrónico</label>
                  <input
                    type="email"
                    value={formInfo.email}
                    onChange={(e) => setFormInfo({ ...formInfo, email: e.target.value })}
                    className="w-full py-2.5 text-[14px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => (e.target.style.borderBottomColor = C.blue)}
                    onBlur={(e) => (e.target.style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={guardandoInfo}
                    className="gummy-btn px-6 py-3 rounded-2xl font-['Space_Grotesk'] font-extrabold text-[13px] border-2"
                    style={{ background: guardandoInfo ? C.slate : C.blue, color: "white", borderColor: C.navy, "--g": C.navy } as CSSProperties}
                  >
                    {guardandoInfo ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>

            {/* Tarjeta Seguridad */}
            <div className="bg-white rounded-[32px] p-8 border-[3px]" style={{ borderColor: C.navy }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: C.creamDeep }}>
                  <Lock size={18} color={C.mandarin} />
                </div>
                <h2 className="font-['Space_Grotesk'] font-extrabold text-[19px]" style={{ color: C.navy }}>Seguridad</h2>
              </div>

              {passError && (
                <div className="mb-5 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-2" style={{ background: "rgba(248,145,12,0.12)", color: "#AE6D21", border: "1px solid rgba(248,145,12,0.25)" }}>
                  ⚠️ {passError}
                </div>
              )}

              {passExito && (
                <div className="mb-5 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-2" style={{ background: "rgba(132,209,117,0.18)", color: "#3D7A41", border: "1px solid rgba(132,209,117,0.4)", animation: "checkPop .35s ease-out" }}>
                  <Check size={16} /> ¡Contraseña actualizada de forma segura!
                </div>
              )}

              <form onSubmit={handleGuardarPass} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Contraseña actual</label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    value={formPass.actual}
                    onChange={(e) => setFormPass({ ...formPass, actual: e.target.value })}
                    className="w-full py-2.5 text-[14px] bg-transparent outline-none transition-colors duration-150"
                    style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                    onFocus={(e) => (e.target.style.borderBottomColor = C.mandarin)}
                    onBlur={(e) => (e.target.style.borderBottomColor = "rgba(18,38,58,0.15)")}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Nueva contraseña</label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formPass.nueva}
                      onChange={(e) => setFormPass({ ...formPass, nueva: e.target.value })}
                      className="w-full py-2.5 text-[14px] bg-transparent outline-none transition-colors duration-150"
                      style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                      onFocus={(e) => (e.target.style.borderBottomColor = C.mandarin)}
                      onBlur={(e) => (e.target.style.borderBottomColor = "rgba(18,38,58,0.15)")}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.slate }}>Confirmar contraseña</label>
                    <input
                      type="password"
                      placeholder="Repite la nueva contraseña"
                      value={formPass.confirmar}
                      onChange={(e) => setFormPass({ ...formPass, confirmar: e.target.value })}
                      className="w-full py-2.5 text-[14px] bg-transparent outline-none transition-colors duration-150"
                      style={{ borderBottom: "2px solid rgba(18,38,58,0.15)", color: C.navy, fontFamily: "'Inter',sans-serif" }}
                      onFocus={(e) => (e.target.style.borderBottomColor = C.mandarin)}
                      onBlur={(e) => (e.target.style.borderBottomColor = "rgba(18,38,58,0.15)")}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={guardandoPass || !formPass.actual || !formPass.nueva || !formPass.confirmar}
                    className="gummy-btn px-6 py-3 rounded-2xl font-['Space_Grotesk'] font-extrabold text-[13px] border-2 flex items-center gap-2 disabled:opacity-60"
                    style={{ background: guardandoPass ? C.slate : C.mandarin, color: "white", borderColor: C.navy, "--g": C.navy } as CSSProperties}
                  >
                    <Key size={16} />
                    {guardandoPass ? "Actualizando..." : "Actualizar contraseña"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}