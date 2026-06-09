import axios from "axios";

const API_URL = "http://localhost:3000";

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
};

export const logoutRequest = async (token: string) => {
  return axios.post(`${API_URL}/auth/logout`,{},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const registerRequest = async (userData: any) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
}