import { Backlog } from "../types/Backlog.types";

type Props = {
  game: Backlog;
};

export function Game({ game }: Props) {
  if (!game) {
    return null;
  }

  return (
    <div draggable className="game-card mb-3">
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
