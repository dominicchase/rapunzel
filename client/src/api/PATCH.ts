import axios from "axios";
import { authData, getUserId } from "../utils/auth";
import {
  UpdateBacklogRequestBody,
  UpdateBacklogResponseBody,
} from "../types/Backlog.types";

const API_URL = import.meta.env.VITE_APP_API_URL;

const userId = getUserId();

export function updateBacklog(
  body: UpdateBacklogRequestBody
): Promise<UpdateBacklogResponseBody> {
  return axios.patch(
    `${API_URL}/backlog/update`,
    { ...body, userId },
    {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    }
  );
}
