import React, { useEffect, useState } from "react";
import { Game } from "../types/Games.types";
import Games from "./Games";

function AddGame() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<Game[] | undefined>([]);

  useEffect(() => {
    if (search)
      fetch(`http://localhost:3001/api/game?search=${search}`)
        .then((res) => res.json())
        .then((data) => setGames(data));
  }, [search]);

  return (
    <>
      <input
        className="mb-4"
        name="search"
        value={search}
        onChange={(event) => handleChange(event)}
      />

      <Games games={games} />
    </>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }
}

export default AddGame;
