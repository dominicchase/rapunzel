import axios from "axios";
import { authData, getUserId } from "../utils/auth";

const API_URL = import.meta.env.VITE_APP_API_URL;

const userId = getUserId();

export function updateBacklog(body: {
  gameId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}) {
  return axios.patch(
    `${API_URL}/backlog/update`,
    { ...body, userId },
    {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    }
  );
}
