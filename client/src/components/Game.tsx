import { useDrag } from "react-dnd";
import { Backlog } from "../types/Backlog.types";

type Props = {
  game: Backlog;
};

export function Game({ game }: Props) {
  const [{ isDragging }, drag] = useDrag({
    type: "GAME",
    item: game,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (!game) {
    return null;
  }

  return (
    <div
      draggable
      className="game-card mb-3"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <section className="col-2">
        <img className="game-img" src={game.cover.url} />
      </section>
      <section>
        <p>{game.name}</p>
      </section>
      <section>
        <button onClick={() => console.log(`Remove ${game.name} from Backlog`)}>
          &times;
        </button>
      </section>
    </div>
  );
}
