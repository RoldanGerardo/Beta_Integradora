import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  adminObtenerArticulos,
  adminCrearArticulo,
  adminActualizarArticulo,
  adminEliminarArticulo,
} from "../../services/EducativoApi";
import { Articulo } from "../../models/Articulo";
import ConfirmModal from "../../Components/ConfirmModal";

const PAGE_SIZE = 6;

const CATEGORIAS_SUGERIDAS = [
  "Ahorro",
  "Presupuesto",
  "Inversión",
  "Tarjetas de crédito",
  "Educación financiera",
  "Emprendimiento",
  "Metas financieras",
  "Errores comunes",
];

type FormArticulo = {
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  categoria: string;
  autor: string;
  fecha: string; // yyyy-mm-dd (formato del <input type="date">)
  tiempoLectura: string;
  tags: string; // separados por coma en el formulario
  destacado: boolean;
};

const FORM_VACIO: FormArticulo = {
  titulo: "",
  resumen: "",
  contenido: "",
  imagen: "",
  categoria: "",
  autor: "Equipo BETA",
  fecha: new Date().toISOString().slice(0, 10),
  tiempoLectura: "4",
  tags: "",
  destacado: false,
};

// El resto de la plataforma guarda las fechas como "dd-mm-yyyy" (ver
// formatFecha en Articulos.tsx), mientras que <input type="date"> trabaja
// en "yyyy-mm-dd". Estas dos funciones traducen entre ambos formatos sin
// tocar el resto de la aplicación.
function fechaAInput(fecha: string): string {
  const partes = fecha.split("-");
  if (partes.length !== 3) return new Date().toISOString().slice(0, 10);
  const [dia, mes, anio] = partes;
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function inputAFecha(valor: string): string {
  const partes = valor.split("-");
  if (partes.length !== 3) return valor;
  const [anio, mes, dia] = partes;
  return `${dia}-${mes}-${anio}`;
}

export default function AdminArticulos() {
  const { token } = useAuth();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Articulo | null>(null);
  const [form, setForm] = useState<FormArticulo>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  const [aEliminar, setAEliminar] = useState<Articulo | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = () => {
    if (!token) return;
    setCargando(true);
    adminObtenerArticulos(token)
      .then(setArticulos)
      .catch(() => setError("No se pudieron cargar los artículos."))
      .finally(() => setCargando(false));
  };

  useEffect(cargar, [token]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return articulos;
    return articulos.filter(
      (a) =>
        a.titulo.toLowerCase().includes(q) ||
        (a.categoria ?? "").toLowerCase().includes(q) ||
        (a.autor ?? "").toLowerCase().includes(q)
    );
  }, [articulos, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (a: Articulo) => {
    setEditando(a);
    setForm({
      titulo: a.titulo,
      resumen: a.resumen ?? "",
      contenido: a.contenido,
      imagen: a.imagen ?? "",
      categoria: a.categoria ?? "",
      autor: a.autor ?? "",
      fecha: fechaAInput(a.fecha),
      tiempoLectura: String(a.tiempoLectura ?? 4),
      tags: (a.tags ?? []).join(", "),
      destacado: !!a.destacado,
    });
    setModalAbierto(true);
  };

  const guardar = async () => {
    if (!token) return;
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("El título y el contenido son obligatorios.");
      return;
    }

    setGuardando(true);
    setError(null);

    const datos = {
      titulo: form.titulo.trim(),
      resumen: form.resumen.trim(),
      contenido: form.contenido.trim(),
      imagen: form.imagen.trim(),
      categoria: form.categoria.trim() || "Educación financiera",
      autor: form.autor.trim() || "Equipo BETA",
      fecha: inputAFecha(form.fecha),
      tiempoLectura: Number(form.tiempoLectura) || 4,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      destacado: form.destacado,
    };

    try {
      if (editando?.id !== undefined) {
        await adminActualizarArticulo(token, editando.id, datos);
      } else {
        await adminCrearArticulo(token, datos);
      }
      setModalAbierto(false);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!token || aEliminar?.id === undefined) return;
    setEliminando(true);
    try {
      await adminEliminarArticulo(token, aEliminar.id);
      setAEliminar(null);
      cargar();
    } catch {
      setError("No se pudo eliminar el artículo.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen p-8" style={{ background: "#FFFACB", fontFamily: "'Space Grotesk',sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: "#12263A" }}>Artículos</h1>
          <p className="text-[13px]" style={{ color: "#668EA5", fontFamily: "'Inter',sans-serif" }}>
            Gestiona el contenido educativo de la plataforma
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all duration-150 hover:brightness-105 active:scale-95"
          style={{ background: "#12263A", color: "#FFFACB" }}
        >
          <Plus size={15} /> Nuevo artículo
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
              placeholder="Buscar por título, categoría o autor..."
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: "#12263A", fontFamily: "'Inter',sans-serif" }}
            />
          </div>
        </div>

        {cargando ? (
          <div className="flex items-center gap-2 text-[13px] py-8 justify-center" style={{ color: "#668EA5" }}>
            <Loader2 size={18} className="animate-spin" /> Cargando artículos...
          </div>
        ) : paginados.length === 0 ? (
          <p className="text-center py-8 text-[13px]" style={{ color: "#668EA5" }}>No se encontraron artículos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(18,38,58,0.08)" }}>
                  {["Título", "Categoría", "Autor", "Fecha", "Destacado", "Acciones"].map((h) => (
                    <th key={h} className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#668EA5" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: "1px solid rgba(18,38,58,0.05)" }}>
                    <td className="py-2.5 px-3 text-[13px] font-semibold max-w-[260px] truncate" style={{ color: "#12263A" }}>{a.titulo}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: "rgba(64,95,250,0.10)", color: "#405FFA" }}
                      >
                        {a.categoria ?? "Educación financiera"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[13px]" style={{ color: "#668EA5" }}>{a.autor ?? "Equipo BETA"}</td>
                    <td className="py-2.5 px-3 text-[13px]" style={{ color: "#668EA5" }}>{a.fecha}</td>
                    <td className="py-2.5 px-3">
                      {a.destacado ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full w-fit" style={{ background: "rgba(250,190,11,0.20)", color: "#8A5B00" }}>
                          <Star size={11} /> Sí
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold" style={{ color: "#9AA9B6" }}>No</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => abrirEditar(a)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "#405FFA" }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setAEliminar(a)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors" style={{ color: "#B91C1C" }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(18,38,58,0.45)" }} onClick={() => setModalAbierto(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-[16px] mb-4" style={{ color: "#12263A" }}>
              {editando ? "Editar artículo" : "Nuevo artículo"}
            </h3>
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              <input
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                style={{ background: "#F4EDEA", color: "#12263A" }}
              />
              <textarea
                placeholder="Descripción corta (resumen). Si se deja vacío se genera a partir del contenido."
                value={form.resumen}
                onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                rows={2}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none resize-none"
                style={{ background: "#F4EDEA", color: "#12263A" }}
              />
              <textarea
                placeholder="Contenido completo"
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                rows={6}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none resize-none"
                style={{ background: "#F4EDEA", color: "#12263A" }}
              />
              <input
                placeholder="URL de la imagen de portada (opcional)"
                value={form.imagen}
                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                style={{ background: "#F4EDEA", color: "#12263A" }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  list="categorias-sugeridas"
                  placeholder="Categoría"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                  style={{ background: "#F4EDEA", color: "#12263A" }}
                />
                <datalist id="categorias-sugeridas">
                  {CATEGORIAS_SUGERIDAS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <input
                  placeholder="Autor"
                  value={form.autor}
                  onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                  style={{ background: "#F4EDEA", color: "#12263A" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                  style={{ background: "#F4EDEA", color: "#12263A" }}
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Minutos de lectura"
                  value={form.tiempoLectura}
                  onChange={(e) => setForm({ ...form, tiempoLectura: e.target.value })}
                  className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                  style={{ background: "#F4EDEA", color: "#12263A" }}
                />
              </div>
              <input
                placeholder="Etiquetas separadas por coma (ej: ahorro, hábitos)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full py-2 px-3 text-[13px] rounded-xl outline-none"
                style={{ background: "#F4EDEA", color: "#12263A" }}
              />
              <label className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "#12263A" }}>
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                />
                Marcar como artículo destacado
              </label>
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
        titulo="¿Eliminar artículo?"
        mensaje={`Esta acción eliminará el artículo "${aEliminar?.titulo}" permanentemente.`}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
        cargando={eliminando}
      />
    </div>
  );
}