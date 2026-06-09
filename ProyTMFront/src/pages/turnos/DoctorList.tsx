
import { Link } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/turnos.css";
import { useEffect, useState } from "react";

import {
  getDoctores,
  deleteDoctor,
} from "../../api/doctores";

import ConfirmModal, {
  type ModalData,
} from "../../components/ConfirmDeleteModal";

import { useAuth } from "../../context/authcontext";

/* ================= TYPES ================= */



type Doctor = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;

  especialidadId: number;

  especialidad: {
    id: number;
    nombre: string;
  };
};


function DoctorList() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const { user } = useAuth();


  const isAdmin =
    user?.rol === "ADMIN";

  useEffect(() => {

    const loadDoctores = async () => {

      try {

        const data =
          await getDoctores();

        setDoctores(data);

      } catch (err) {

        console.error(err);

        setError(
          "Error al cargar doctores"
        );

      } finally {

        setLoading(false);

      }
    };

    loadDoctores();

  }, []);


  const handleDeleteClick = (
    doctor: Doctor
  ) => {

    setModalData({
      id: doctor.id,
      label:
        `¿Está seguro que desea eliminar al doctor "${doctor.nombre} ${doctor.apellido}"?`,
    });
  };

  const handleConfirmDelete =
    async () => {

      if (!modalData) return;

      const { id } = modalData;

      setModalData(null);

      try {

        await deleteDoctor(id);

        setDoctores((prev) =>
          prev.filter(
            (doctor) =>
              doctor.id !== id
          )
        );

      } catch (err) {

        console.error(err);

        alert(
          "Error al eliminar doctor"
        );

      }
    };

    if (loading) {
      return (
        <TurnosLayout>
          <div className="table-container">
            <h2>Cargando...</h2>
          </div>
        </TurnosLayout>
      );
    }

    if (error) {
      return (
        <TurnosLayout>
          <div className="table-container">
            <h2>{error}</h2>
          </div>
        </TurnosLayout>
      );
    }

  return (
    <TurnosLayout>
      <ConfirmModal
        data={modalData}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalData(null)}
      />

      <div className="turnos-header">

        <h2>👨‍⚕️ Doctores Registrados</h2>

        {isAdmin && (
          <Link
            to="/turnos/doctores/crear"
            className="btn-primary"
          >
            + Nuevo Doctor
          </Link>
        )}
      </div>

      <div className="table-container">
        {doctores.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {doctores.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.nombre}</td>
                  <td>{doctor.apellido}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.telefono}</td>
                  <td>{doctor.especialidad.nombre}</td>

                  {isAdmin && (
                    <td className="actions">

                      <Link
                        to={`/turnos/doctores/editar/${doctor.id}`}
                        className="btn-outline"
                      >
                        Editar
                      </Link>

                      <button
                        className="btn-danger"
                        onClick={() =>
                          handleDeleteClick(
                            doctor
                          )
                        }
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
            No hay doctores registrados.
          </div>
        )}
      </div>
    </TurnosLayout>
  );
}

export default DoctorList;