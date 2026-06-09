import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import "../../styles/register.css";
import { registerRequest } from "../../api/auth";

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) {
    return {
      label: "",
      color: "transparent",
      width: "0%",
      level: 0,
    };
  }

  if (score <= 1) {
    return {
      label: "Débil",
      color: "#e74c3c",
      width: "33%",
      level: 1,
    };
  }

  if (score <= 3) {
    return {
      label: "Media",
      color: "#f39c12",
      width: "66%",
      level: 2,
    };
  }

  return {
    label: "Fuerte",
    color: "#27ae60",
    width: "100%",
    level: 3,
  };
};

type RegisterForm = {
  nombre: string;
  apellido: string;
  password: string;
  email: string;
};

function Register() {
  const [form, setForm] = useState<RegisterForm>({
    nombre: "",
    apellido: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState<string>("");

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (passwordStrength.level < 2) {
      setError("La contraseña es demasiado débil. Utiliza al menos 8 caracteres, una mayúscula y un número.");
      return;
    }
    try {
      await registerRequest({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        rol: "USER",
      });

      alert("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
      setForm({
        nombre: "",
        apellido: "",
        password: "",
        email: "",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError("Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-brand">
          <div className="register-icon">A</div>
          <h2 className="register-title">Crea tu cuenta</h2>
          <p className="register-subtitle">Completa los datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="input-field"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              className="input-field"
              value={form.apellido}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="password-strength-container">
            <div className="password-strength-background">
              <div
                className="password-strength-bar"
                style={{
                  width: passwordStrength.width,
                  backgroundColor: passwordStrength.color,
                }}
              />
            </div>

            {passwordStrength.label && (
              <span
                className="password-strength-label"
                style={{
                  color: passwordStrength.color,
                }}
              >
                {passwordStrength.label}
              </span>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-group">
            <button type="submit" className="btn-register">
              Registrarse
            </button>

            <Link to="/login" className="btn-login-link">
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;