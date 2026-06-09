import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useState } from "react";
import "../styles/turnos-layout.css";
import { useAuth } from "../context/authcontext";
import { logoutRequest } from "../api/auth.ts";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
};

function TurnosLayout({ children }: { children: ReactNode }) {
  const { user, logout, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canManage = user?.rol === "ADMIN";
  const canView = user?.rol === "USER" || user?.rol === "ADMIN";

  const handleLogout = () => {
    try {
      if (token) logoutRequest(token);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      logout();
      window.location.href = "/login";
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2967/2967178.png"
              alt="Logo"
              className="logo"
              onClick={() => navigate("/turnos/inicio")}
            />
          </div>
          <h1>Sistema de Turnos Médicos</h1>
        </div>
        <div className="header-right">
          {user ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">
                  {(user as User).nombre.charAt(0)}{(user as User).apellido.charAt(0)}
                </div>
                <span>{(user as User).nombre} {(user as User).apellido}</span>
              </div>
              <button className="btn" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/registro" className="btn-outline">Registrarse</Link>
            </>
          )}
        </div>
      </header>

      <div className="main-container">
        {/* SIDEBAR */}
        {user && (
          <>
            {/* Botón toggle con flecha */}
            <button
              className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
              onClick={toggleSidebar}
              aria-label="Abrir/cerrar menú"
            >
              ›
            </button>

            {/* Overlay oscuro */}
            <div
              className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
              <ul>
                {canView && (
                  <>
                    <li><Link to="/turnos/inicio" onClick={toggleSidebar}>Inicio</Link></li>
                    <li><Link to="/turnos/doctores" onClick={toggleSidebar}>Doctores</Link></li>
                    <li><Link to="/turnos" onClick={toggleSidebar}>Turnos</Link></li>
                    <li><Link to="/turnos/especialidades" onClick={toggleSidebar}>Especialidades</Link></li>
                    <li><Link to="/turnos/disponibilidad" onClick={toggleSidebar}>Disponibilidad</Link></li>
                    <li><Link to="/turnos/estadisticas" onClick={toggleSidebar}>Estadisticas</Link></li>
                  </>
                )}
                {canManage && (
                  <>
                    <li><Link to="/turnos/pacientes" onClick={toggleSidebar}>Pacientes</Link></li>
                    <li><Link to="/turnos/usuarios" onClick={toggleSidebar}>Ver Usuarios</Link></li>

                  </>
                )}
              </ul>
            </nav>
          </>
        )}

        {/* CONTENT */}
        <main className="main-content">{children}</main>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} Sistema de Turnos Médicos
      </footer>
    </div>
  );
}
export default TurnosLayout;