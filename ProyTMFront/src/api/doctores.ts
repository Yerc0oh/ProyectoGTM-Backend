import axios from "axios";

const API = "http://localhost:3000/doctores";

export const getDoctores = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getDoctorById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createDoctor = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateDoctor = async (
  id: number,
  data: any
) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};