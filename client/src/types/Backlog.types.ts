import { Game } from "./Games.types";

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type Backlog = Game & {
  status: Status;
  completedAt: string | null;
};

export type GetBacklogRequestParams = {
  status: Status;
  page: number;
};

export type GetBacklogResponseBody = {
  backlog: Backlog[];
  totalItems: number;
  totalPages: number;
};

export type UpdateBacklogRequestBody = {
  gameId: number;
  status: Status;
};

export type UpdateBacklogResponseBody = {
  message: string;
};
