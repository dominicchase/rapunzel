import { Game } from "./Game";
import { Backlog } from "../types/Backlog.types";
import { ConnectDropTarget } from "react-dnd";

type Props = {
  games: Backlog[];
  drop: ConnectDropTarget;
};

export function GameContainer({ games, drop }: Props) {
  return (
    <div className="game-column" ref={drop}>
      {games.map((game) => (
        <Game key={game.id} game={game} />
      ))}
    </div>
  );
}
