import { useState } from "react";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";

/* ================= TYPES ================= */



/* ================= MOCK API ================= */

const mockAPI = {
  sendRecordatorios: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("RECORDATORIOS ENVIADOS");
        resolve(true);
      }, 1000);
    }),
};

/* ================= COMPONENT ================= */


function RecordatorioEnviar() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");

    try {
      await mockAPI.sendRecordatorios();
      setMessage("Recordatorios enviados correctamente ✔");
    } catch {
      setMessage("Error al enviar recordatorios ❌");
    }

    setLoading(false);
  };

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>🔔 Enviar Recordatorios</h2>

        <p>
          Este proceso enviará correos a todos los pacientes con turnos próximos.
        </p>

        <button
          onClick={handleSend}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Enviando..." : "Enviar recordatorios"}
        </button>

        {message && (
          <div className="info-box" style={{ marginTop: "1rem" }}>
            {message}
          </div>
        )}
      </div>
    </TurnosLayout>
  );
}

export default RecordatorioEnviar;