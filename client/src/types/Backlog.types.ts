import { Game } from "./Games.types";

export type Backlog = Game & {
  status: Status;
  completedAt: string | null;
};

export type Status = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
