import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";

import { createPaciente, updatePaciente, getPacienteById } from "../../api/pacientes";

/* ================= TYPES ================= */


type PacienteFormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
};

/* ================= COMPONENT ================= */


function PacienteForm() {

  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<PacienteFormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    direccion: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {

    const loadPaciente = async () => {

      if (!id) return;

      try {

        const data =
          await getPacienteById(
            Number(id)
          );

        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email || "",
          telefono: data.telefono,
          direccion: data.direccion,

          fecha_nacimiento:
            data.fecha_nacimiento
              .split("T")[0],
        });

      } catch (error) {

        console.error(error);

        setError(
          "Error al cargar paciente"
        );
      }
    };

    loadPaciente();

  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellido ||
      !form.email ||
      !form.telefono ||
      !form.fecha_nacimiento ||
      !form.direccion
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");

    try {

      if (isEdit) {

        await updatePaciente(
          Number(id),
          form
        );

      } else {

        await createPaciente(form);

      }

      navigate("/turnos/pacientes");

    } catch (error) {

      console.error(error);

      setError(
        "Error al guardar paciente"
      );
    }

  };

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>
          {isEdit
            ? "Editar Paciente"
            : "Nuevo Paciente"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                name="fecha_nacimiento"
                type="date"
                value={form.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

          </div>

          {error && (
            <div className="error-box">{error}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                navigate("/turnos/pacientes")
              }
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {isEdit ? "Actualizar Paciente" : "Crear Paciente"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default PacienteForm;