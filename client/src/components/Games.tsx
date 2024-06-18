import { Game } from "../types/Games.types";

type Props = {
  games: Game[] | undefined;
  handleAddGame: (gameId: number) => void;
};

function Games({ games, handleAddGame }: Props) {
  return games ? (
    <div /*className="row row-cols-1 row-cols-md-2 row-cols-lg-3"*/>
      {games.map((game) => (
        <div className="d-flex gap-3 mb-3">
          <img className="game-card col-3" src={game.cover.url} width="100%" />
          <section className="col text-start">
            <p className="fw-bold">{game.name}</p>
            {"genres" in game && <p>Genre(s): {getGameGenres(game.genres)}</p>}
            <button onClick={() => handleAddGame(game.id)}>
              Add to Backlog
            </button>
          </section>
        </div>
      ))}
    </div>
  ) : (
    <p>No Games</p>
  );

  function getGameGenres(genres: { id: number; name: string }[]) {
    return genres.map((genre) => genre.name).join(", ");
  }
}

export default Games;
