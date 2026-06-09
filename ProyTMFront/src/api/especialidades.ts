import axios from "axios";

const API = "http://localhost:3000/especialidades";

export const getEspecialidades = async () => {
  const res = await axios.get(API);
  return res.data;
}

export const getEspecialidadById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createEspecialidad = async (data: {
  nombre: string;
  descripcion?: string;
}) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateEspecialidad = async (
  id: number,
  data: {
    nombre: string;
    descripcion?: string;
  }
) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
};

export const deleteEspecialidad = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};