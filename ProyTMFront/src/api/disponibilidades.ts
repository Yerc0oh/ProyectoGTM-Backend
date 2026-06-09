import axios from "axios";

const API = "http://localhost:3000/disponibilidades";

export const getDisponibilidades = async () => {
  const res = await axios.get(API);
  return res.data;
}

export const getDisponibilidadById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
}

export const createDisponibilidad = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
}

export const updateDisponibilidad = async (id: number, data: any) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
}

export const deleteDisponibilidad = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
}