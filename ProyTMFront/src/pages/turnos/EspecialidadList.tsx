import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/turnos.css";
import { deleteEspecialidad, getEspecialidades } from "../../api/especialidades";
import { useAuth } from "../../context/authcontext";

type Especialidad = {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
};

// ── Modal de confirmación ──────────────────────────
type ModalData = { id: number; nombre: string } | null;

function ConfirmModal({
  data,
  onConfirm,
  onCancel,
}: {
  data: ModalData;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!data) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-icon-wrap">
            {/* ícono inline para no depender de ninguna lib */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>

          <div>
            <h3 className="modal-title" id="modal-title">
              ¿Eliminar especialidad?
            </h3>
            <p className="modal-desc">
              ¿Está seguro que desea eliminar la especialidad{" "}
              <strong>"{data.nombre}"</strong>?
            </p>
            <p className="modal-warning">
              ⚠ Esta acción no se puede revertir.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────
function EspecialidadList() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState<ModalData>(null);

  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEspecialidades();
        setEspecialidades(data);
      } catch {
        setError("Error al cargar especialidades");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Abre el modal guardando qué especialidad se quiere borrar
  const handleDeleteClick = (esp: Especialidad) => {
    setModalData({ id: esp.id, nombre: esp.nombre });
  };

  // El usuario confirmó en el modal
  const handleConfirmDelete = async () => {
    if (!modalData) return;
    const { id } = modalData;
    setModalData(null);

    try {
      await deleteEspecialidad(id);
      setEspecialidades((prev) => prev.filter((esp) => esp.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la especialidad");
    }
  };

  return (
    <TurnosLayout>
      {/* Modal */}
      <ConfirmModal
        data={modalData}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalData(null)}
      />

      <div className="turnos-header">
        <h2>📚 Especialidades</h2>
        {isAdmin && (
          <Link to="/turnos/especialidades/crear" className="btn-primary">
            + Nueva Especialidad
          </Link>
        )}
      </div>

      {loading && <div className="alert-info">Cargando...</div>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && especialidades.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {especialidades.map((esp) => (
              <tr key={esp.id}>
                <td>{esp.nombre}</td>
                <td>{esp.descripcion ?? "-"}</td>
                <td>{esp.estado ? "Activo" : "Inactivo"}</td>
                {isAdmin && (
                  <td className="actions">
                    <Link
                      to={`/turnos/especialidades/editar/${esp.id}`}
                      className="btn-outline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(esp)}
                      className="btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <div className="alert-info">No hay especialidades registradas.</div>
        )
      )}
    </TurnosLayout>
  );
}

export default EspecialidadList;