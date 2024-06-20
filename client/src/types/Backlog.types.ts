import { Game } from "./Games.types";

export type Backlog = Game & {
  status: Status;
  completedAt: string | null;
};

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type Action =
  | { type: "GET_BACKLOG"; backlog: Backlog[]; status: Status; page: number }
  | { type: "ADD_GAME"; gameId: number; status: Status }
  | { type: "REMOVE_GAME"; gameId: number }
  | { type: "UPDATE_BACKLOG"; gameId: number; status: Status }
  | { type: "SET_PAGE"; status: Status; page: number };
