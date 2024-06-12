import React, { useEffect, useState } from "react";
import { Game } from "./types/Games.types";
import Games from "./components/Games";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState<Game[] | undefined>([]);

  useEffect(() => {
    if (search)
      fetch(`http://localhost:3001/api/games?search=${search}`)
        .then((res) => res.json())
        .then((data) => setGames(data));
  }, [search]);

  return (
    <>
      <h3>Rapunzel</h3>

      <input
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

export default App;
