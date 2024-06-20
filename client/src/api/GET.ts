import axios from "axios";
import { getUserId } from "../utils/auth";

const API_URL = import.meta.env.VITE_APP_API_URL;

const userId = getUserId();

export function getBacklog(params: {
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  page: number;
}) {
  return axios.get(
    `${API_URL}/backlog?userId=${userId}&status=${params.status}&page=${params.page}`
  );
}
