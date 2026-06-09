import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import "../../styles/login.css";
import { loginRequest } from "../../api/auth.ts";
import { useAuth } from "../../context/authcontext";
import { useEffect } from "react";

type LoginForm = {
  email: string;
  password: string;
};


function Login() {
  const { login } = useAuth();

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await loginRequest(form.email, form.password);
      login(data.user, data.access_token);

      if (captchaInput !== captcha) {
        setError("Captcha incorrecto");
        generateCaptcha();
        return;
      }

      setError("");
      window.location.href = "/turnos/inicio";
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-brand">
          <div className="login-icon">SGTM</div>
          <h2 className="login-title">Bienvenido al Sistema de Gestion de Turnos</h2>
          <p className="login-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              required
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
              required
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="captcha">
              Captcha
            </label>

            <div className="captcha-box">
              {captcha}
            </div>

            <input
              id="captcha"
              type="text"
              name="captcha"
              placeholder="Ingresa el codigo"
              required
              className="input-field"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />

          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

        <p className="register-link">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;