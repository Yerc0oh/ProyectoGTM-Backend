import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TurnosLayout from "../../components/TurnosLayout";
import ConfirmModal, { type ModalData } from "../../components/ConfirmDeleteModal";
import "../../styles/turnos.css";
import {
    getUsers,
    deleteUser,
    type Usuario,
} from "../../api/users";

/* ================= TYPES ================= */

type LogAcceso = {
    fechaHora: string;
    evento: "INGRESO" | "SALIDA";
};

type SortKey = "nombre" | "ultimoAcceso" | "rol";


/* ================= HELPERS ================= */

function getUltimoAcceso(logs?: LogAcceso[]): string {


    if (!logs || logs.length === 0) return "—";

    const ingresos = logs
        .filter((l) => l.evento === "INGRESO")
        .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());

    if (ingresos.length === 0) return "—";

    const fecha = new Date(ingresos[0].fechaHora);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
        return `hoy, ${fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (diffDias === 1) {
        return `ayer, ${fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function getTimestamp(logs?: LogAcceso[]): number {
    if (!logs || logs.length === 0) return 0;
    const ingresos = logs
        .filter((l) => l.evento === "INGRESO")
        .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
    return ingresos.length > 0 ? new Date(ingresos[0].fechaHora).getTime() : 0;
}

function getInitials(nombre?: string, apellido?: string): string {
    const n = nombre?.trim()?.charAt(0) ?? "";
    const a = apellido?.trim()?.charAt(0) ?? "";

    const initials = (n + a).toUpperCase();

    return initials || "??";
}


/* ================= COMPONENT ================= */

function UsuarioList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("nombre");
    const [modalData, setModalData] = useState<ModalData>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const data = await getUsers();

            setUsuarios(data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const sorted = [...usuarios].sort((a, b) => {
        if (sortKey === "nombre") {
            return `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`);
        }
        if (sortKey === "ultimoAcceso") {
            return getTimestamp(b.logsAcceso ?? []) - getTimestamp(a.logsAcceso ?? []);
        }
        if (sortKey === "rol") {
            return a.rol.localeCompare(b.rol);
        }
        return 0;
    });

    const handleDeleteClick = (u: Usuario) => {
        setModalData({
            id: u.id,
            label: `¿Está seguro que desea eliminar al usuario "${u.nombre} ${u.apellido}"?`,
        });
    };

    const handleConfirmDelete = async () => {
        if (!modalData) return;
        const { id } = modalData;
        setModalData(null);
        try {
            await deleteUser(id);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } catch {
            alert("Error al eliminar el usuario");
        }
    };


    return (
        <TurnosLayout>
            <ConfirmModal
                data={modalData}
                onConfirm={handleConfirmDelete}
                onCancel={() => setModalData(null)}
            />

            <div className="turnos-header">
                <h2>👥 Usuarios del sistema</h2>
                <Link to="/turnos/usuarios/crear" className="btn-primary">
                    + Nuevo Usuario
                </Link>
            </div>

            {/* Ordenar */}
            <div className="list-toolbar">
                <label htmlFor="sortSelect">Ordenar por</label>
                <select
                    id="sortSelect"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                >
                    <option value="nombre">Nombre (A → Z)</option>
                    <option value="ultimoAcceso">Último acceso primero</option>
                    <option value="rol">Rol</option>
                </select>
            </div>

            {loading && <div className="alert-info">Cargando usuarios...</div>}
            {error && <div className="alert-error">{error}</div>}

            {!loading && sorted.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Último acceso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div className="user-name-cell">
                                        <div className="user-avatar">
                                            {getInitials(u.nombre, u.apellido)}
                                        </div>
                                        <span>{u.nombre} {u.apellido}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`rol-badge rol-${u.rol.toLowerCase()}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td className="last-access-cell">
                                    {getUltimoAcceso(u.logsAcceso)}
                                </td>
                                <td className="actions">
                                    <Link
                                        to={`/turnos/usuarios/editar/${u.id}`}
                                        className="btn-outline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteClick(u)}
                                        className="btn-danger"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <div className="alert-info">No hay usuarios registrados.</div>
            )}
        </TurnosLayout>
    );
}

export default UsuarioList;