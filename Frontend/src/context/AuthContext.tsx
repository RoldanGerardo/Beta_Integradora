import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as loginRequest, register as registerRequest, Sesion, UsuarioSesion } from "../services/authApi.js";

interface AuthContextValue {
  usuario: UsuarioSesion | null;
  token: string | null;
  isAdmin: boolean;
  cargando: boolean;
  iniciarSesion: (identificador: string, password: string) => Promise<UsuarioSesion>;
  registrar: (nombre: string, email: string, password: string, username?: string) => Promise<UsuarioSesion>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "beta_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardada = localStorage.getItem(STORAGE_KEY);
    if (guardada) {
      try {
        setSesion(JSON.parse(guardada));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setCargando(false);
  }, []);

  const iniciarSesion = async (identificador: string, password: string) => {
    const nuevaSesion = await loginRequest(identificador, password);
    setSesion(nuevaSesion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaSesion));
    return nuevaSesion.usuario;
  };

  const registrar = async (nombre: string, email: string, password: string, username?: string) => {
    const nuevaSesion = await registerRequest(nombre, email, password, username);
    setSesion(nuevaSesion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaSesion));
    return nuevaSesion.usuario;
  };

  const cerrarSesion = () => {
    setSesion(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion?.usuario ?? null,
        token: sesion?.token ?? null,
        isAdmin: sesion?.usuario?.rol === "admin",
        cargando,
        iniciarSesion,
        registrar,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}