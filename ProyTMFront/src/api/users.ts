import api from "./api";

export type LogAcceso = {
    fechaHora: string;
    evento: "INGRESO" | "SALIDA";
};

export type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: "ADMIN" | "USER";
    estado: boolean;

    logsAcceso: LogAcceso[];
};

export type CreateUserDto = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: "ADMIN" | "USER";
};

export type UpdateUserDto = {
  nombre: string;
  apellido: string;
  email: string;
  rol: "ADMIN" | "USER";
  estado: boolean;
};

export const getUsers = async (): Promise<Usuario[]> => {
    const { data } = await api.get("/users");
    return data;
};

export const getUserById = async (
    id: number
): Promise<Usuario> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
};

export const createUser = async (payload: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: "ADMIN" | "USER";
}) => {
    const { data } = await api.post(
        "/users",
        payload
    );

    return data;
};

export const updateUser = async (
    id: number,
    payload: {
        nombre?: string;
        apellido?: string;
        email?: string;
        password?: string;
        rol?: "ADMIN" | "USER"
        estado: boolean;
    }
) => {
    const { data } = await api.patch(
        `/users/${id}`,
        payload
    );

    return data;
};

export const deleteUser = async (
    id: number
) => {
    const { data } = await api.delete(
        `/users/${id}`
    );

    return data;
};