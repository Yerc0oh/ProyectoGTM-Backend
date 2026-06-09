import api from "./api.ts";

/* ================= TYPES ================= */

export interface Turno {
    id: number;

    doctorId: number;
    pacienteId: number;

    fechaHora: string;

    estado:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "CANCELADO"
    | "COMPLETADO";

    motivoConsulta?: string | null;

    recordatorioEnviado: boolean;

    fechaRecordatorio?: string | null;

    doctor?: {
        id: number;
        nombre: string;
        apellido: string;
    };

    paciente?: {
        id: number;
        nombre: string;
        apellido: string;
    };
}

export interface CreateTurnoDto {
    doctorId: number;
    pacienteId: number;
    fechaHora: string;
    motivoConsulta?: string;
}

export interface UpdateTurnoDto {
    doctorId?: number;
    pacienteId?: number;
    fechaHora?: string;
    estado?:
    | "PENDIENTE"
    | "CONFIRMADO"
    | "CANCELADO"
    | "COMPLETADO";
    motivoConsulta?: string;
}

/* ================= CRUD ================= */

export const getTurnos = async (): Promise<Turno[]> => {
    const { data } = await api.get("/turnos");
    return data;
};

export const getTurnoById = async (
    id: number
): Promise<Turno> => {
    const { data } = await api.get(`/turnos/${id}`);
    return data;
};

export const createTurno = async (
    turno: CreateTurnoDto
): Promise<Turno> => {
    const { data } = await api.post(
        "/turnos",
        turno
    );

    return data;
};

export const updateTurno = async (
    id: number,
    turno: UpdateTurnoDto
): Promise<Turno> => {
    const { data } = await api.patch(
        `/turnos/${id}`,
        turno
    );

    return data;
};

export const deleteTurno = async (
    id: number
): Promise<void> => {
    await api.delete(`/turnos/${id}`);
};

export const confirmarTurno = async (
    id: number
): Promise<Turno> => {
    const { data } = await api.patch(
        `/turnos/${id}/confirmar`
    );

    return data;
};

export const completarTurno = async (
    id: number
): Promise<Turno> => {
    const { data } = await api.patch(
        `/turnos/${id}/completar`
    );

    return data;
};

export const cancelarTurno = async (
    id: number
): Promise<Turno> => {
    const { data } = await api.patch(
        `/turnos/${id}/cancelar`
    );

    return data;
};

export const descargarComprobante = async (
    id: number
) => {
    const response = await api.get(
        `/turnos/${id}/pdf`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const enviarRecordatorio = async (
    id: number
) => {
    const { data } = await api.patch(
        `/turnos/${id}/recordatorio`
    );

    return data;
};

export const enviarMasivos = async () => {
    const { data } = await api.post(
        `/turnos/recordatorios/enviar`
    );

    return data;
};

export const getTurnosHoy = async () => {
    const { data } = await api.get(
        `/turnos/hoy`
    );

    return data;
};