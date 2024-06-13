import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function register(body: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/user/register`, body);

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch {
    /* empty */
  }
}

export async function login(body: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/user/login`, body);

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data;
  } catch {
    /* empty */
  }
}
