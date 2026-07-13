import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Power, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {adminObtenerUsuarios, adminCrearUsuario, adminActualizarUsuario,adminCambiarEstado, adminEliminarUsuario, UsuarioSesion, Rol,} from "../../services/authApi";
import ConfirmModal from "../../Components/ConfirmModal";

const PAGE_SIZE = 6;

export default function AdminUsuarios() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioSesion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<"todos" | Rol>("todos");
  const [pagina, setPagina] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UsuarioSesion | null>(null);
  const [form, setForm] = useState({ nombre: "", username: "", email: "", password: "", rol: "usuario" as Rol });
  const [guardando, setGuardando] = useState(false);

  const [aEliminar, setAEliminar] = useState<UsuarioSesion | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = () => {
    if (!token) return;
    setCargando(true);
    adminObtenerUsuarios(token)
      .then(setUsuarios)
      .catch(() => setError("No se pudieron cargar los usuarios."))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, [token]);

  const filtrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideBusqueda =
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.username.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase());
      const coincideRol = filtroRol === "todos" || u.rol === filtroRol;
      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE);

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: "", username: "", email: "", password: "", rol: "usuario" });
    setModalAbierto(true);
  };

  const abrirEditar = (u: UsuarioSesion) => {
    setEditando(u);
    setForm({ nombre: u.nombre, username: u.username, email: u.email, password: "", rol: u.rol });
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!token) return;
    setGuardando(true);
    setError(null);
    try {
      if (editando) {
        await adminActualizarUsuario(token, editando.id, {
          nombre: form.nombre, username: form.username, email: form.email, rol: form.rol,
        });
      } else {
        await adminCrearUsuario(token, form);
      }
      setModalAbierto(false);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstado = async (u: UsuarioSesion) => {
    if (!token) return;
    try {
      await adminCambiarEstado(token, u.id, !u.activo);
      cargar();
    } catch {
      setError("No se pudo cambiar el estado.");
    }
  };

  const confirmarEliminar = async () => {
    if (!token || !aEliminar) return;
    setEliminando(true);
    try {
      await adminEliminarUsuario(token, aEliminar.id);
      setAEliminar(null);
      cargar();
    } catch {
      setError("No se pudo eliminar el usuario.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen p-8" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: "#12263A" }}>Usuarios</h1>
          <p className="text-[13px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
            Gestiona las cuentas de la plataforma
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-105 active:scale-95"
          style={{ background: "#12263A", color: "#FFFACB" }}
        >
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-3 mb-4 flex items-center gap-2 text-[12px] font-semibold" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto font-bold">✕</button>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(18,38,58,0.06)" }}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F4EDEA" }}>
            <Search size={15} style={{ color: "#668EA5" }} />
            <input
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              placeholder="Buscar por nombre, usuario o correo..."
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}
            />
          </div>
          <div className="flex gap-1.5">
            {(["todos", "usuario", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => { setFiltroRol(r); setPagina(1); }}
                className="px-3 py-2 rounded-full text-[11px] font-bold uppercase transition-colors"
                style={{
                  background: filtroRol === r ? "#405FFA" : "#F4EDEA",
                  color: filtroRol === r ? "white" : "#668EA5",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {cargando ? (
          <div className="flex items-center gap-2 text-[13px] py-8 justify-center" style={{ color: "#668EA5" }}>
            <Loader2 size={18} className="animate-spin" /> Cargando usuarios...
          </div>
        ) : paginados.length === 0 ? (
          <p className="text-center py-8 text-[13px]" style={{ color: "#668EA5" }}>No se encontraron usuarios.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(18,38,58,0.08)" }}>
                  {["Nombre", "Usuario", "Correo", "Rol", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#668EA5" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid rgba(18,38,58,0.05)" }}>
                    <td className="py-2.5 px-3 text-[13px] font-semibold" style={{ color: "#12263A" }}>{u.nombre}</td>
                    <td className="py-2.5 px-3 text-[13px]" style={{ color: "#668EA5" }}>@{u.username}</td>
                    <td className="py-2.5 px-3 text-[13px]" style={{ color: "#668EA5" }}>{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: u.rol === "admin" ? "rgba(248,145,12,0.15)" : "rgba(64,95,250,0.10)", color: u.rol === "admin" ? "#AE6D21" : "#405FFA" }}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => toggleEstado(u)}
                        className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full transition-colors"
                        style={{ background: u.activo ? "rgba(132,209,117,0.20)" : "rgba(185,28,28,0.10)", color: u.activo ? "#707D4E" : "#B91C1C" }}
                      >
                        <Power size={11} /> {u.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => abrirEditar(u)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "#405FFA" }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setAEliminar(u)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "#B91C1C" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className="w-7 h-7 rounded-full text-[12px] font-bold transition-colors"
                style={{ background: paginaSegura === p ? "#405FFA" : "transparent", color: paginaSegura === p ? "white" : "#668EA5" }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(18,38,58,0.45)" }} onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-[16px] mb-4" style={{ color: "#12263A" }}>
              {editando ? "Editar usuario" : "Nuevo usuario"}
            </h3>
            <div className="space-y-3">
              <input placeholder="Nombre completo" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none" style={{ background: "#F4EDEA", color: "#12263A" }} />
              <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none" style={{ background: "#F4EDEA", color: "#12263A" }} />
              <input placeholder="Correo" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none" style={{ background: "#F4EDEA", color: "#12263A" }} />
              {!editando && (
                <input placeholder="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] rounded-xl outline-none" style={{ background: "#F4EDEA", color: "#12263A" }} />
              )}
              <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none" style={{ background: "#F4EDEA", color: "#12263A" }}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setModalAbierto(false)} className="px-4 py-2 rounded-full text-[12px] font-bold" style={{ background: "#F4EDEA", color: "#12263A" }}>
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando} className="px-4 py-2 rounded-full text-[12px] font-bold" style={{ background: "#405FFA", color: "white", opacity: guardando ? 0.7 : 1 }}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        abierto={!!aEliminar}
        titulo="¿Eliminar usuario?"
        mensaje={`Esta acción eliminará a "${aEliminar?.nombre}" permanentemente.`}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
        cargando={eliminando}
      />
    </div>
  );
}