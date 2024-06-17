import { Game } from "./Games.types";

export type Backlog = Game & {
  status: Status;
  completedAt: Date | null;
};

export type Status = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
