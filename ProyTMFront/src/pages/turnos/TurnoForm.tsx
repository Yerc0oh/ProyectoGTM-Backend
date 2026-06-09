import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";
import { useEffect } from "react";

import {
  createTurno,
  updateTurno,
  getTurnoById,
} from "../../api/turnos";

import { getPacientes } from "../../api/pacientes";

import { getDoctores } from "../../api/doctores";

import { useParams } from "react-router-dom";


type TurnoFormData = {
  doctorId: string;
  pacienteId: string;

  fecha: string;
  hora: string;

  motivoConsulta: string;
};


function TurnoForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditing = Boolean(id);

  const [form, setForm] =
    useState<TurnoFormData>({
      doctorId: "",
      pacienteId: "",

      fecha: "",
      hora: "",

      motivoConsulta: "",
    });

  const [pacientes, setPacientes] = useState<any[]>([]);

  const [doctores, setDoctores] = useState<any[]>([]);

  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pacientesData, doctoresData] =
        await Promise.all([
          getPacientes(),
          getDoctores(),
        ]);

      setPacientes(pacientesData);
      setDoctores(doctoresData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      loadTurno(Number(id));
    }
  }, [id]);

  const loadTurno = async (id: number) => {
    try {
      const turno = await getTurnoById(id);

      const fecha = new Date(turno.fechaHora);

      setForm({
        doctorId: String(turno.doctorId),

        pacienteId: String(turno.pacienteId),

        fecha: fecha.toISOString().split("T")[0],

        hora: fecha
          .toISOString()
          .slice(0, 5),

        motivoConsulta:
          turno.motivoConsulta || "",

      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.doctorId ||
      !form.pacienteId ||
      !form.fecha ||
      !form.hora
    ) {
      setErrors(
        "Todos los campos obligatorios deben completarse"
      );

      return;
    }

    try {
      const fechaHora =
        `${form.fecha}T${form.hora}:00`;

      if (isEditing) {
        await updateTurno(Number(id), {
          doctorId: Number(form.doctorId),
          pacienteId: Number(form.pacienteId),
          fechaHora,
          motivoConsulta:
            form.motivoConsulta,
        });
      } else {
        await createTurno({
          doctorId: Number(form.doctorId),
          pacienteId: Number(form.pacienteId),
          fechaHora,
          motivoConsulta:
            form.motivoConsulta,
        });
      }

      navigate("/turnos");
    } catch (error: any) {
      console.error(error);

      setErrors(
        error?.response?.data?.message ||
        "Error al guardar turno"
      );
    }
  };

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>
          {isEditing
          ? "Editar Turno"
          : "Registrar Turno"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Paciente</label>

              <select
                name="pacienteId"
                value={form.pacienteId}
                onChange={handleChange}
              >
                <option value="">
                  Seleccione paciente
                </option>

                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Doctor</label>

              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
              >
                <option value="">
                  Seleccione doctor
                </option>

                {doctores.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.nombre} {d.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Motivo de consulta</label>

              <input
                type="text"
                name="motivoConsulta"
                value={form.motivoConsulta}
                onChange={handleChange}
              />
            </div>
          </div>

          {errors && <div className="error-box">{errors}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/turnos")}
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {isEditing ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default TurnoForm;