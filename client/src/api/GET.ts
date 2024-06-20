import axios from "axios";
import { getUserId } from "../utils/auth";
import {
  GetBacklogRequestParams,
  GetBacklogResponseBody,
} from "../types/Backlog.types";

const API_URL = import.meta.env.VITE_APP_API_URL;

const userId = getUserId();

export async function getBacklog(
  params: GetBacklogRequestParams
): Promise<GetBacklogResponseBody> {
  try {
    const response = await axios.get(
      `${API_URL}/backlog?userId=${userId}&status=${params.status}&page=${params.page}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch backlog");
  }
}
