import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type User = {
  username: string;
};

type LayoutProps = {
  user: User | null;
  children: ReactNode;
};

function Layout({ user, children }: LayoutProps) {
  return (
    <>
      <header style={styles.header}>
        <h1>Sistema de Turnos Médicos</h1>

        <nav style={styles.nav}>
          {user ? (
            <>
              <span>
                Bienvenido, <strong>{user.username}</strong>
              </span>
              <Link to="/perfil">Perfil</Link>
              <Link to="/logout">Cerrar sesión</Link>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {children}
      </main>
    </>
  );
}

export default Layout;

import type { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  header: {
    backgroundColor: "#1a6fc9",
    color: "white",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  main: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "1rem",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minHeight: "60vh",
  },
};