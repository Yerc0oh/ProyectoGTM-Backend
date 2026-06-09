import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import ConfirmModal, { type ModalData } from "../../components/ConfirmDeleteModal";
import "../../styles/turnos.css";
import { getPacientes, deletePaciente } from "../../api/pacientes";

type Paciente = {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  estado: boolean;
};

function PacienteList() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData>(null);

  useEffect(() => {
    const loadPacientes = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar pacientes");
      } finally {
        setLoading(false);
      }
    };
    loadPacientes();
  }, []);

  const handleDeleteClick = (paciente: Paciente) => {
    setModalData({
      id: paciente.id,
      label: `¿Está seguro que desea eliminar al paciente "${paciente.nombre} ${paciente.apellido}"?`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!modalData) return;
    const { id } = modalData;
    setModalData(null);

    try {
      await deletePaciente(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar paciente");
    }
  };

  return (
    <TurnosLayout>
      <ConfirmModal
        data={modalData}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalData(null)}
      />

      <div className="turnos-header">
        <h2>🧑‍⚕️ Pacientes Registrados</h2>
        <Link to="/turnos/pacientes/crear" className="btn-primary">
          + Nuevo Paciente
        </Link>
      </div>

      {loading && <div className="alert-info">Cargando pacientes...</div>}
      {error && <div className="alert-danger">{error}</div>}

      <div className="table-container">
        {pacientes.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.email ?? "-"}</td>
                  <td>{paciente.telefono}</td>
                  <td>{paciente.direccion}</td>
                  <td className="actions">
                    <Link
                      to={`/turnos/pacientes/editar/${paciente.id}`}
                      className="btn-outline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(paciente)}
                      className="btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <div className="alert-info">No hay pacientes registrados.</div>
        )}
      </div>
    </TurnosLayout>
  );
}

export default PacienteList;