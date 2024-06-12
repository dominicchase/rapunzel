import axios from "axios";

const API_URL = process.env.API_URL;

export async function login(body: { email: string; password: string }) {
  const response = await axios.post(`${API_URL}/login`, body);

  const { accessToken, refreshToken } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
}
