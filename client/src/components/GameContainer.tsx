import { useMemo, useState } from "react";
import { Game } from "./Game";
import { Backlog } from "../types/Backlog.types";

type Props = {
  backlog: Backlog[];
  placeholderIndex: number | null;
};

export function GameContainer({ backlog, placeholderIndex }: Props) {
  const [draggedItem, setDraggedItem] = useState<Backlog | null>(null);

  return (
    <div className="game-column">
      {backlog.map((game, index) => (
        <div key={game.id}>
          {index === placeholderIndex && <Placeholder />}
          <Game game={game} setDraggedItem={setDraggedItem} />
        </div>
      ))}
    </div>
  );
}

function Placeholder() {
  return <div className="placeholder" />;
}
