import TurnosLayout from "../../components/TurnosLayout";
import { Link } from "react-router-dom";
import "../../styles/turnos.css";
import { useEffect, useState } from "react";
import type { Turno } from "../../api/turnos";

import {
  getTurnos,
  deleteTurno,
  confirmarTurno,
  completarTurno,
  cancelarTurno,
  descargarComprobante,
  enviarMasivos,
} from "../../api/turnos";

import ConfirmModal, {
  type ModalData,
} from "../../components/ConfirmDeleteModal";

import { useAuth } from "../../context/authcontext";

function ComprobanteModal({
  data,
  onDescargar,
  onCerrar,
}: {
  data: { id: number } | null;
  onDescargar: (id: number) => void;
  onCerrar: () => void;
}) {
  if (!data) return null;

  return (
    <div className="modal-backdrop" onClick={onCerrar}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comprobante-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-icon-wrap modal-icon-success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <div>
            <h3 className="modal-title" id="comprobante-title">
              Turno completado
            </h3>
            <p className="modal-desc">
              ¿Le gustaría descargar el comprobante del turno{" "}
              <strong>(.pdf)</strong>?
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onCerrar}>
            No descargar
          </button>
          <button
            className="btn-primary"
            onClick={() => onDescargar(data.id)}
          >
            ⬇ Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

function ListaTurnos() {

  const [loadingRecordatorios, setLoadingRecordatorios] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const [comprobanteModal, setComprobanteModal] = useState<{ id: number } | null>(null);

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      const data = await getTurnos();
      setTurnos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatFecha = (fechaHora: string) => {
    const fecha = new Date(fechaHora);

    return fecha.toISOString();
  };

  const formatHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora);

    return fecha.toISOString().slice(11, 16);
  };


  const handleDeleteClick = (turno: Turno) => {
    setModalData({
      id: turno.id,
      label: `¿Eliminar turno de ${turno.paciente?.nombre} ${turno.paciente?.apellido}?`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!modalData) return;

    try {
      await deleteTurno(modalData.id);

      setTurnos((prev) =>
        prev.filter((t) => t.id !== modalData.id)
      );
    } catch (error) {
      console.error(error);
      alert("Error al eliminar turno");
    }

    setModalData(null);
  };

  const handleConfirmar = async (id: number) => {
    try {
      const turnoActualizado =
        await confirmarTurno(id);

      setTurnos((prev) =>
        prev.map((t) =>
          t.id === id ? turnoActualizado : t
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompletar = async (id: number) => {
    try {
      const turnoActualizado = await completarTurno(id);
      setTurnos((prev) =>
        prev.map((t) => (t.id === id ? turnoActualizado : t))
      );
      setComprobanteModal({ id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelar = async (id: number) => {
    try {
      const turnoActualizado =
        await cancelarTurno(id);

      setTurnos((prev) =>
        prev.map((t) =>
          t.id === id ? turnoActualizado : t
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescargarComprobante = async (
    id: number
  ) => {
    try {
      const blob =
        await descargarComprobante(id);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        `comprobante-turno-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setComprobanteModal(null);

    } catch (error) {
      console.error(error);
      alert(
        "No se pudo descargar el comprobante"
      );
    }
  };

  const handleEnviarRecordatorios = async () => {
    try {
      setLoadingRecordatorios(true);

      const res = await enviarMasivos();

      setMsg(res.enviados > 0 ? "Recordatorios enviados" : "No se enviaron recordatorios");

      await loadTurnos(); // refresca estado visual
    } catch (error) {
      console.error(error);
      alert("Error enviando recordatorios");
    } finally {
      setLoadingRecordatorios(false);
    }
  };
  return (
    <TurnosLayout>
      <ConfirmModal
        data={modalData}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalData(null)}
      />

      <ComprobanteModal
        data={comprobanteModal}
        onDescargar={handleDescargarComprobante}
        onCerrar={() => setComprobanteModal(null)}
      />

      <div className="turnos-header">
        <h2>📅 Lista de Turnos</h2>

        {isAdmin && (
          <Link to="/turnos/crear" className="btn-primary">
            + Nuevo Turno
          </Link>
        )}
      </div>

      <div className="table-container">
        {turnos.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                {isAdmin && <th>Recodatorio</th>}
                {isAdmin && <th>Acciones</th>}

              </tr>
            </thead>

            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.paciente?.nombre}{"   "}{turno.paciente?.apellido}</td>
                  <td>Dr. {turno.doctor?.nombre}{"   "}{turno.doctor?.apellido}</td>
                  <td>{formatFecha(turno.fechaHora)}</td>
                  <td>{formatHora(turno.fechaHora)}</td>
                  <td>{turno.estado}</td>

                  {isAdmin && (
                    <td>
                      {turno.recordatorioEnviado
                        ? "✅ Enviado"
                        : "❌ No enviado"}
                    </td>
                  )}
                  {isAdmin && (
                    <td className="actions">

                      <Link
                        to={`/turnos/editar/${turno.id}`}
                        className="btn-outline"
                      >
                        Editar
                      </Link>

                      <button
                        className="btn-success"
                        onClick={() =>
                          handleConfirmar(turno.id)
                        }
                      >
                        Confirmar
                      </button>

                      <button
                        className="btn-primary"
                        onClick={() =>
                          handleCompletar(turno.id)
                        }
                      >
                        Completar
                      </button>

                      <button
                        className="btn-warning"
                        onClick={() =>
                          handleCancelar(turno.id)
                        }
                      >
                        Cancelar
                      </button>

                      <button
                        className="btn-danger"
                        onClick={() =>
                          handleDeleteClick(turno)
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
            No hay turnos registrados en el sistema.
          </div>
        )}
      </div>

      {turnos.length > 0 && (
        <div style={{ marginTop: "1rem" }}>

          {isAdmin && (
            <button
              className="btn-secondary"
              onClick={handleEnviarRecordatorios}
              disabled={loadingRecordatorios}
            >
              🔔 Enviar Recordatorios
              {loadingRecordatorios && <span className="loading-spinner"></span>}
            </button>
          )}

          {msg && <p className="alert-info">{msg}</p>}
        </div>
      )}
    </TurnosLayout>
  );
}

export default ListaTurnos;