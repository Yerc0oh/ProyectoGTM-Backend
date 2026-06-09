import axios from "axios";

const API = "http://localhost:3000/pacientes";

export const getPacientes = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getPacienteById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createPaciente = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updatePaciente = async (
  id: number,
  data: any
) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
};

export const deletePaciente = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};