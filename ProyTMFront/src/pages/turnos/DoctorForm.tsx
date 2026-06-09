import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";
import { createDoctor, updateDoctor, getDoctorById } from "../../api/doctores";
import { getEspecialidades } from "../../api/especialidades";


/* ================= TYPES ================= */

type DoctorFormData = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  especialidadId: number;
};


/* ================= COMPONENT ================= */



function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [especialidades, setEspecialidades] = useState<{ id: number; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<DoctorFormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    especialidadId: 0,
  });

  /* ================= HANDLERS ================= */

  useEffect(() => {

    const loadEspecialidades =
      async () => {

        try {

          const data =
            await getEspecialidades();

          setEspecialidades(data);

        } catch (err) {

          console.error(err);

        }
      };

    loadEspecialidades();

  }, []);

  useEffect(() => {

    const loadDoctor =
      async () => {

        if (!id) {

          setLoading(false);
          return;

        }

        try {

          const doctor =
            await getDoctorById(
              Number(id)
            );

          setForm({
            nombre: doctor.nombre,
            apellido: doctor.apellido,
            email: doctor.email,
            telefono: doctor.telefono,
            especialidadId:
              doctor.especialidadId,
          });

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);

        }
      };

    loadDoctor();

  }, [id]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "especialidadId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    if (
      !form.nombre ||
      !form.apellido ||
      !form.email ||
      !form.telefono ||
      !form.especialidadId
    ) {
      setError(
        "Todos los campos son obligatorios"
      );
      return;
    }

    try {

      if (isEditing) {

        await updateDoctor(
          Number(id),
          form
        );

      } else {

        await createDoctor(form);

      }

      navigate(
        "/turnos/doctores"
      );

    } catch (err) {

      console.error(err);

      setError(
        "Error al guardar doctor"
      );
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <TurnosLayout>
        <div className="form-container">
          <h2>Cargando...</h2>
        </div>
      </TurnosLayout>
    );
  }

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>
          {isEditing
            ? "Editar Doctor"
            : "Crear Nuevo Doctor"}
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
              <label>Especialidad</label>
              <select
                className="selectEsp"
                name="especialidadId"
                value={form.especialidadId}
                onChange={handleChange}
              >
                <option value={0}>
                  -- Seleccione una especialidad --
                </option>
                {especialidades.map((esp) => (
                  <option
                    key={esp.id}
                    value={esp.id}
                  >
                    {esp.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                navigate("/turnos/doctores")
              }
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {isEditing
                ? "Actualizar Doctor"
                : "Crear Doctor"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default DoctorForm;