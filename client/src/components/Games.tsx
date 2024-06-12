import { Game } from "../types/Games.types";

type Props = {
  games: Game[] | undefined;
};

function Games({ games }: Props) {
  return games ? (
    games.map((game) => (
      <div className="d-flex mb-3">
        <img src={game.cover.url} height={200} width={112} />
        <p>{game.name}</p>
      </div>
    ))
  ) : (
    <p>No Games</p>
  );
}

export default Games;
