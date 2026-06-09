import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";
import { createEspecialidad, updateEspecialidad, getEspecialidadById } from "../../api/especialidades";

/* ================= TYPES ================= */

type User = {
  username: string;
  rol?: string;
  isSuperuser?: boolean;
};

type EspecialidadFormData = {
  nombre: string;
  descripcion: string;
};

/* ================= COMPONENT ================= */

type Props = {
  user: User | null;
};

function EspecialidadForm() {
  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<EspecialidadFormData>({
    nombre: "",
    descripcion: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadEspecialidad = async () => {
      if (!id) return;

      try {
        const data = await getEspecialidadById(Number(id));

        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
        });

      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la especialidad");
      }
    };

    loadEspecialidad();
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

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {

      if (isEdit) {

        await updateEspecialidad(
          Number(id),
          form
        );

      } else {

        await createEspecialidad(form);

      }

      navigate("/turnos/especialidades");

    } catch (error) {

      console.error(error);

      setError(
        "Error al guardar la especialidad"
      );
    }
  };

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>
          {isEdit
            ? "✏️ Editar Especialidad"
            : "📚 Registrar Especialidad"}
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
              <label>Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
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
                navigate("/turnos/especialidades")
              }
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              {isEdit
                ? "Actualizar Especialidad"
                : "Guardar Especialidad"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default EspecialidadForm;