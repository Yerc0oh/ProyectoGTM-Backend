import { Routes, Route, Navigate } from "react-router-dom";
/* AUTH */
import Login from "../pages/auth/Login";
import Registro from "../pages/auth/Register";
import Perfil from "../pages/auth/Perfil";

/* TURNOS */
import TurnosList from "../pages/turnos/ListaTurnos";
import TurnoForm from "../pages/turnos/TurnoForm";

import DoctorList from "../pages/turnos/DoctorList";
import DoctorForm from "../pages/turnos/DoctorForm";

import PacienteList from "../pages/turnos/PacienteList";
import PacienteForm from "../pages/turnos/PacienteForm";

import EspecialidadList from "../pages/turnos/EspecialidadList";
import EspecialidadForm from "../pages/turnos/EspecialidadForm";

import DisponibilidadList from "../pages/turnos/VerDisponibilidad";
import DisponibilidadForm from "../pages/turnos/DisponibilidadForm";

import Inicio from "../pages/turnos/Inicio";

import RecordatorioEnviar from "../pages/turnos/RecordatorioEnviar";


import UsuarioList from "../pages/turnos/UsersList";
import UsuarioForm from "../pages/turnos/UsersForm";

import Estadisticas from "../pages/turnos/Estadisticas";

/* MOCK USER */
const user = {
  username: "admin",
  rol: "administrador",
};

export default function AppRouter() {
  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil usuario={user} />} />

      {/* ================= TURNOS ================= */}

      <Route
        path="/turnos"
        element={<TurnosList />}
      />

      <Route
        path="/turnos/nuevo"
        element={<TurnoForm />}
      />

      <Route
        path="/turnos/crear"
        element={<TurnoForm />}
      />

      <Route
        path="/turnos/editar/:id"
        element={<TurnoForm />}
      />


      {/* ================= DOCTORES ================= */}

      <Route
        path="/turnos/doctores"
        element={
          <DoctorList />
        }
      />

      <Route
        path="/turnos/doctores/nuevo"
        element={<DoctorForm />}
      />

      <Route
        path="/turnos/doctores/crear"
        element={<DoctorForm />}
      />

      <Route
        path="/turnos/doctores/editar/:id"
        element={<DoctorForm />}
      />


      {/* ================= PACIENTES ================= */}

      <Route
        path="/turnos/pacientes"
        element={
          <PacienteList />
        }
      />

      <Route
        path="/turnos/pacientes/nuevo"
        element={<PacienteForm />}
      />

      <Route
        path="/turnos/pacientes/crear"
        element={<PacienteForm />}
      />

      <Route
        path="/turnos/pacientes/editar/:id"
        element={<PacienteForm />}
      />

      {/* ================= ESPECIALIDADES ================= */}

      <Route
        path="/turnos/especialidades"
        element={
          <EspecialidadList />
        }
      />

      <Route
        path="/turnos/especialidades/nuevo"
        element={<EspecialidadForm />}
      />

      <Route
        path="/turnos/especialidades/crear"
        element={<EspecialidadForm />}
      />

      <Route
        path="/turnos/especialidades/editar/:id"
        element={<EspecialidadForm />}
      />

      <Route
        path="/turnos/especialidades/eliminar/:id"
        element={<EspecialidadList />}
      />

      {/* ================= DISPONIBILIDAD ================= */}

      <Route
        path="/turnos/disponibilidad"
        element={
          <DisponibilidadList />
        }
      />

      <Route
        path="/turnos/disponibilidad/nuevo"
        element={<DisponibilidadForm />}
      />

      <Route
        path="/turnos/disponibilidad/crear"
        element={<DisponibilidadForm />}
      />

      <Route
        path="/turnos/disponibilidad/editar/:id"
        element={<DisponibilidadForm />}
      />


      {/* ================= RECORDATORIOS ================= */}

      <Route
        path="/turnos/recordatorios"
        element={
          <RecordatorioEnviar/>
        }
      />

      {/* ================= USUARIOS ================= */}

      <Route
        path="/turnos/usuarios"
        element={
          <UsuarioList />
        }
      />

      <Route
        path="/turnos/usuarios/crear"
        element={<UsuarioForm />}
      />

      <Route
        path="/turnos/usuarios/editar/:id"
        element={<UsuarioForm />}
       />

      {/* ==================ESTADISTICAS================ */}

      <Route 
        path="/turnos/estadisticas"
        element={<Estadisticas />}
      />

      {/* ================= INICIO ================= */}
      <Route
        path="/turnos/inicio"
        element={
          <Inicio />
        }
      />
    </Routes>
  );
}