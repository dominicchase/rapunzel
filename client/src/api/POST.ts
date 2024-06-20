import axios from "axios";
import { authData, getUserId, setAuthData } from "../utils/auth";

const API_URL = import.meta.env.VITE_APP_API_URL;

const userId = getUserId();

export async function register(body: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/user/register`, body);

    const { accessToken, refreshToken, id } = response.data;

    setAuthData(accessToken, refreshToken, id);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function login(body: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/user/login`, body);

    const { accessToken, refreshToken, id } = response.data;

    setAuthData(accessToken, refreshToken, id);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export function addToBacklog(body: {
  gameId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}) {
  return axios.post(
    `${API_URL}/backlog/add`,
    { ...body, userId },
    {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    }
  );
}
