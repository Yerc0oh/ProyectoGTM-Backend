import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";
import { createDisponibilidad, updateDisponibilidad, getDisponibilidadById } from "../../api/disponibilidades";
import { getDoctores } from "../../api/doctores";

/* ================= TYPES ================= */

type Doctor = {
  id: number;
  nombre: string;
  apellido: string;

  especialidad: {
    id: number;
    nombre: string;
  };
};

type DisponibilidadFormData = {
  doctorId: number | "";
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
};

const diasSemana = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];


/* ================= COMPONENT ================= */


function DisponibilidadForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [doctores, setDoctores] = useState<Doctor[]>([]);

  const [form, setForm] =
    useState<DisponibilidadFormData>({
      doctorId: "",
      diaSemana: "",
      horaInicio: "",
      horaFin: "",
    });

  const [error, setError] = useState("");

  /* ================= HANDLERS ================= */

  useEffect(() => {
    loadDoctores();
  }, []);

  const loadDoctores = async () => {
    try {
      const data = await getDoctores();
      setDoctores(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      loadDisponibilidad();
    }
  }, [id]);

  const loadDisponibilidad = async () => {
    try {
      const disp = await getDisponibilidadById(
        Number(id)
      );

      setForm({
        doctorId: disp.doctorId,
        diaSemana: disp.diaSemana,
        horaInicio: disp.horaInicio.slice(0, 5),
        horaFin: disp.horaFin.slice(0, 5),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const doctorSeleccionado = doctores.find(
    (d) => d.id === Number(form.doctorId)
  );

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "doctorId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.doctorId ||
      !form.diaSemana ||
      !form.horaInicio ||
      !form.horaFin
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      if (isEdit) {
        await updateDisponibilidad(
          Number(id),
          form
        );
      } else {
        await createDisponibilidad(form);
      }

      navigate("/turnos/disponibilidad");
    } catch (err) {
      console.error(err);
      setError(
        "Error al guardar la disponibilidad"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>{isEdit ? "Editar" : "Registrar"} disponibilidad</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* DOCTOR */}
            <div className="form-group">
              <label>Doctor</label>

              <select
                className="selectGeneral"
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
              >
                <option value="">
                  Seleccionar doctor
                </option>

                {doctores.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    Dr. {doctor.nombre} {doctor.apellido}
                  </option>
                ))}
              </select>
            </div>

            {/* ESPECIALIDAD (auto) */}
            <div className="form-group">
              <label>Especialidad</label>

              <input
                disabled
                value={
                  doctorSeleccionado
                    ?.especialidad.nombre || ""
                }
              />
            </div>

            {/* DIA */}
            <div className="form-group">
              <label>Día</label>
              <select
                className="selectGeneral"
                name="diaSemana"
                value={form.diaSemana}
                onChange={handleChange}
              >
                <option value="">
                  Seleccionar día
                </option>

                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            {/* HORA INICIO */}
            <div className="form-group">
              <label>Hora inicio</label>
              <input
                type="time"
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleChange}
              />
            </div>

            {/* HORA FIN */}
            <div className="form-group">
              <label>Hora fin</label>
              <input
                type="time"
                name="horaFin"
                value={form.horaFin}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                navigate("/turnos/disponibilidad")
              }
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {isEdit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default DisponibilidadForm;