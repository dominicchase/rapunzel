import { Game } from "./Game";
import { Backlog } from "../types/Backlog.types";

type Props = {
  backlog: Backlog[];
};

export function GameContainer({ backlog }: Props) {
  return (
    <div className="game-column">
      {backlog.map((game) => (
        <Game key={game.id} game={game} />
      ))}
    </div>
  );
}
