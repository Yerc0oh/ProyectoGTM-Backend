import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/turnos.css";
import { getDisponibilidades, deleteDisponibilidad } from "../../api/disponibilidades";
import ConfirmModal, { type ModalData } from "../../components/ConfirmDeleteModal";
import { useAuth } from "../../context/authcontext";

/* ================= TYPES ================= */

type Disponibilidad = {
  id: number;

  doctorId: number;

  diaSemana: string;

  horaInicio: string;
  horaFin: string;

  doctor: {
    id: number;
    nombre: string;
    apellido: string;

    especialidad: {
      id: number;
      nombre: string;
    };
  };
};



/* ================= COMPONENT ================= */

function VerDisponibilidad() {
  const { user } = useAuth();

  const isAdmin = user?.rol === "ADMIN";

  const [disponibilidades, setDisponibilidades] =
    useState<Disponibilidad[]>([]);

  const [doctorFilter, setDoctorFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [modalData, setModalData] =
    useState<ModalData | null>(null);


  useEffect(() => {

    const loadDisponibilidades =
      async () => {

        try {

          const data =
            await getDisponibilidades();

          setDisponibilidades(data);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);

        }
      };

    loadDisponibilidades();

  }, []);

  const doctores = useMemo(() => {

    const unicos = new Map();

    disponibilidades.forEach((d) => {

      unicos.set(
        d.doctor.id,
        `${d.doctor.nombre} ${d.doctor.apellido}`
      );

    });

    return Array.from(
      unicos.entries()
    );

  }, [disponibilidades]);

  const filtradas = doctorFilter
    ? disponibilidades.filter(
      (d) =>
        d.doctor.id ===
        Number(doctorFilter)
    )
    : disponibilidades;


  const handleDeleteClick = (
    disponibilidad: Disponibilidad
  ) => {

    setModalData({
      id: disponibilidad.id,
      label:
        `¿Eliminar disponibilidad de ${disponibilidad.doctor.nombre} ${disponibilidad.doctor.apellido}?`,
    });

  };

  const handleConfirmDelete =
    async () => {

      if (!modalData) return;

      const { id } = modalData;

      setModalData(null);

      try {

        await deleteDisponibilidad(id);

        setDisponibilidades(
          (prev) =>
            prev.filter(
              (d) =>
                d.id !== id
            )
        );

      } catch (err) {

        console.error(err);

        alert(
          "Error al eliminar disponibilidad"
        );

      }
    };

  if (loading) {
    return (
      <TurnosLayout>
        <div className="alert-info">
          Cargando...
        </div>
      </TurnosLayout>
    );
  }
  
  return (
    <TurnosLayout>
      { /* MODAL ELIMINAR */ }
      {modalData && (
        <ConfirmModal
          data={modalData}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModalData(null)}
        />
      )}

      {/* HEADER */}
      <div className="turnos-header">
        <h2>🕒 Lista de Disponibilidades</h2>

        {isAdmin && (
          <Link
            to="/turnos/disponibilidad/crear"
            className="btn-primary"
          >
            + Registrar Disponibilidad
          </Link>
        )}
      </div>

      {/* FILTER */}
      <div className="filter-box">
        <label>Buscar por doctor:</label>

        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value="">Ver todos los doctores</option>

          {doctores.map(([id, nombre]) => (

            <option
              key={id}
              value={id}
            >
              {nombre}
            </option>

          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="table-container">
        {filtradas.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Especialidad</th>
                <th>Día</th>
                <th>Horario</th>

                {isAdmin && <th>Acciones</th>}

              </tr>
            </thead>

            <tbody>
              {filtradas.map((d) => (
                <tr key={d.id}>
                  <td>
                    {d.doctor.nombre}
                    {" "}
                    {d.doctor.apellido}
                  </td>
                  <td>{d.doctor.especialidad.nombre}</td>
                  <td>{d.diaSemana}</td>
                  <td>
                    {d.horaInicio} - {d.horaFin}
                  </td>

                  {isAdmin && (
                    <td className="actions">
                      <Link
                        to={`/turnos/disponibilidad/editar/${d.id}`}
                        className="btn-secondary"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteClick(d)}
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
          <div className="alert-info">
            No hay disponibilidades registradas.
          </div>
        )}
      </div>
    </TurnosLayout>
  );
}

export default VerDisponibilidad;