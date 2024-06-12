import { Game } from "../types/Games.types";

type Props = {
  games: Game[] | undefined;
};

function Games({ games }: Props) {
  return games ? (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      {games.map((game) => (
        <section className="col">
          <img className="game-card" src={game.cover.url} width="100%" />
          <p>{game.name}</p>
        </section>
      ))}
    </div>
  ) : (
    <p>No Games</p>
  );
}

export default Games;
