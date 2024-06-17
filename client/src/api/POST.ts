import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjY5ZGM5MzI2MzY5NmY0MjA1OWRlMmUiLCJpYXQiOjE3MTg1ODE3MzMsImV4cCI6MTcxODU4NTMzM30.w-xLQC1hhau5cWac4TubVORhwVRmqNnrGUMzHVqaJiQ";

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

export function addToBacklog(body: {
  userId: string;
  gameId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}) {
  return axios.post(`${API_URL}/backlog/add`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getBacklog(params: {
  userId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  page?: number;
  size?: number;
}) {
  return axios.get(
    `${API_URL}/backlog?userId=${params.userId}&status=${params.status}`
  );
}
