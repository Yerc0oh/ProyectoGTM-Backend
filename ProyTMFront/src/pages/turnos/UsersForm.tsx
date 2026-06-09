import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/forms.css";
import { createUser, updateUser, getUserById } from "../../api/users.ts";

/* ================= PASSWORD STRENGTH ================= */

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { label: "", color: "transparent", width: "0%", level: 0 };
  if (score <= 1) return { label: "Débil", color: "#e74c3c", width: "33%", level: 1 };
  if (score <= 3) return { label: "Media", color: "#f39c12", width: "66%", level: 2 };
  return { label: "Fuerte", color: "#27ae60", width: "100%", level: 3 };
}

/* ================= TYPES ================= */

type UsuarioFormData = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmarPassword: string;
  rol: "ADMIN" | "USER";
  estado: boolean;
};

/* ================= COMPONENT ================= */

function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<UsuarioFormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmarPassword: "",
    rol: "USER",
    estado: true,
  });

  const [error, setError] = useState("");
  const passwordStrength = getPasswordStrength(form.password);

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        const data = await getUserById(Number(id));

        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          estado: data.estado,
          password: "",
          confirmarPassword: "",
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el usuario");
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim()) {
      setError("Nombre, apellido y correo son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("El correo no tiene un formato válido");
      return;
    }

    if (!isEdit) {
      if (!form.password) {
        setError("La contraseña es obligatoria");
        return;
      }
      if (passwordStrength.level < 2) {
        setError("La contraseña es demasiado débil. Usá al menos 8 caracteres, una mayúscula y un número.");
        return;
      }
      if (form.password !== form.confirmarPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
    }

    try {
      if (isEdit) {
        await updateUser(Number(id), {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          rol: form.rol,
          estado: form.estado,
        });
      } else {
        await createUser({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          rol: form.rol,
        });
      }

      navigate("/turnos/usuarios");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Error al guardar el usuario"
      );
    }
  };

  return (
    <TurnosLayout>
      <div className="form-container">
        <h2>{isEdit ? "✏️ Editar Usuario" : "👤 Registrar Usuario"}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="usuario@clinica.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rol">Rol</label>
              <select id="rol" name="rol" value={form.rol} onChange={handleChange}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Contraseña — solo al crear */}
            {!isEdit && (
              <>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {/* Barra de fuerza */}
                  <div className="password-strength-container">
                    <div className="password-strength-background">
                      <div
                        className="password-strength-bar"
                        style={{
                          width: passwordStrength.width,
                          backgroundColor: passwordStrength.color,
                          transition: "width 0.3s ease, background-color 0.3s ease",
                        }}
                      />
                    </div>
                    {passwordStrength.label && (
                      <span
                        className="password-strength-label"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarPassword">Confirmar contraseña</label>
                  <input
                    id="confirmarPassword"
                    name="confirmarPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmarPassword}
                    onChange={handleChange}
                  />
                  {form.confirmarPassword && form.password !== form.confirmarPassword && (
                    <p className="field-error">Las contraseñas no coinciden</p>
                  )}
                </div>
              </>
            )}

            {/* Estado — solo al editar */}
            {isEdit && (
              <div className="form-group form-group--checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={form.estado}
                    onChange={handleChange}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>
            )}

          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/turnos/usuarios")}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Actualizar Usuario" : "Guardar Usuario"}
            </button>
          </div>
        </form>
      </div>
    </TurnosLayout>
  );
}

export default UsuarioForm;