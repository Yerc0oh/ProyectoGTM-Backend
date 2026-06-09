import TurnosLayout from "../../components/TurnosLayout";
import "../../styles/estadisticas.css";
import { useEffect, useState } from "react";
import { getEstadisticas } from "../../api/estadisticas";
/* ================= TYPES ================= */

type EstadoData = {
    label: string;
    value: number;
    color: string;
};

type EspecialidadData = {
    label: string;
    value: number;
    color: string;
};

type StatsCards = {
    totalTurnos: number;
    totalPacientes: number;
    totalDoctores: number;
    totalEspecialidades: number;
};

/* ================= SUBCOMPONENTES ================= */

function StatCard({
    label,
    value,
    icon,
    accentColor,
}: {
    label: string;
    value: number;
    icon: string;
    accentColor: string;
}) {
    return (
        <div className="stat-card" style={{ "--accent": accentColor } as React.CSSProperties}>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
            <span className="stat-icon" aria-hidden="true">{icon}</span>
        </div>
    );
}

function DonutChart({ data }: { data: EstadoData[] }) {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    const RADIUS = 44;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    let offset = 0;
    const slices = data.map((d) => {
        const pct = d.value / total;
        const dash = pct * CIRCUMFERENCE;
        const slice = { ...d, dash, offset };
        offset += dash;
        return slice;
    });

    return (
        <div className="donut-wrap">
            <svg className="donut-svg" width="130" height="130" viewBox="0 0 120 120" aria-hidden="true">
                {/* Track base */}
                <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="18" />

                {slices.map((s, i) => (
                    <circle
                        key={i}
                        cx="60"
                        cy="60"
                        r={RADIUS}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="18"
                        strokeDasharray={`${s.dash} ${CIRCUMFERENCE - s.dash}`}
                        strokeDashoffset={-s.offset}
                        transform="rotate(-90 60 60)"
                    />
                ))}

                <text x="60" y="56" textAnchor="middle" fontSize="15" fontWeight="600" fill="#1a3a5c" fontFamily="monospace">
                    {total}
                </text>
                <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#6c757d">
                    turnos
                </text>
            </svg>

            <div className="donut-legend">
                {data.map((d) => (
                    <div key={d.label} className="legend-item">
                        <span className="legend-dot" style={{ background: d.color }} />
                        <span className="legend-label">{d.label}</span>
                        <span className="legend-val">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BarChart({ data }: { data: EspecialidadData[] }) {
    const max = Math.max(...data.map((d) => d.value));

    return (
        <div className="bar-chart">
            {data.map((d, i) => {
                const pct = Math.round((d.value / max) * 100);
                return (
                    <div key={d.label} className="bar-row" style={{ "--delay": `${0.35 + i * 0.1}s` } as React.CSSProperties}>
                        <span className="bar-label">{d.label}</span>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{ width: `${pct}%`, background: d.color }}
                            >
                                {d.value}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ================= COMPONENT PRINCIPAL ================= */

function Estadisticas() {

    const [cards, setCards] =
        useState<StatsCards>({
            totalTurnos: 0,
            totalPacientes: 0,
            totalDoctores: 0,
            totalEspecialidades: 0,
        });

    const [estadosData, setEstadosData] =
        useState<EstadoData[]>([]);

    const [
        especialidadesData,
        setEspecialidadesData,
    ] = useState<EspecialidadData[]>([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data =
                await getEstadisticas();

            setCards(data.cards);

            setEstadosData([
                {
                    label: "Pendientes",
                    value:
                        data.estados.find(
                            (e) =>
                                e.estado === "PENDIENTE",
                        )?._count || 0,
                    color: "#f59e0b",
                },
                {
                    label: "Confirmados",
                    value:
                        data.estados.find(
                            (e) =>
                                e.estado === "CONFIRMADO",
                        )?._count || 0,
                    color: "#1a6fc9",
                },
                {
                    label: "Completados",
                    value:
                        data.estados.find(
                            (e) =>
                                e.estado === "COMPLETADO",
                        )?._count || 0,
                    color: "#059669",
                },
                {
                    label: "Cancelados",
                    value:
                        data.estados.find(
                            (e) =>
                                e.estado === "CANCELADO",
                        )?._count || 0,
                    color: "#ef4444",
                },
            ]);

            const colores = [
                "#1a6fc9",
                "#0891b2",
                "#7c3aed",
                "#059669",
                "#f59e0b",
                "#ef4444",
            ];

            setEspecialidadesData(
                data.especialidades.map(
                    (esp, index) => ({
                        ...esp,
                        color:
                            colores[
                            index % colores.length
                            ],
                    }),
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <TurnosLayout>
            <div className="estadisticas-container">

                <div className="est-page-header">
                    <h2>📊 Estadísticas del sistema</h2>
                    <p>Resumen general de actividad</p>
                </div>

                {/* CARDS */}
                <div className="stats-cards">
                    <StatCard label="Total Turnos" value={cards.totalTurnos} icon="📋" accentColor="#1a6fc9" />
                    <StatCard label="Total Pacientes" value={cards.totalPacientes} icon="🧑‍⚕️" accentColor="#0891b2" />
                    <StatCard label="Total Doctores" value={cards.totalDoctores} icon="👨‍⚕️" accentColor="#7c3aed" />
                    <StatCard label="Especialidades" value={cards.totalEspecialidades} icon="📚" accentColor="#059669" />
                </div>

                {/* GRÁFICAS */}
                <div className="charts-row">
                    <div className="chart-card">
                        <p className="chart-title">📊 Turnos por Estado</p>
                        <DonutChart data={estadosData} />
                    </div>

                    <div className="chart-card">
                        <p className="chart-title">📈 Turnos por Especialidad</p>
                        <BarChart data={especialidadesData} />
                    </div>
                </div>

            </div>
        </TurnosLayout>
    );
}

export default Estadisticas;