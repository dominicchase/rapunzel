import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AddGame from "./AddGame";
import { getBacklog } from "../api/POST";
import { Backlog, Status } from "../types/Backlog.types";

type Props = {
  title: string;
  status: Status;
};

function List({ title, status }: Props) {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [games, setGames] = useState<Backlog[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  console.log(games);

  // TODO: extract this and handle refreshToken logic
  const isLoggedIn = localStorage.getItem("accessToken");

  if (isFetching) return null;

  return (
    <section>
      <h5 className="text-start">{title}</h5>

      {games.length && games.map((game) => <p>{game.name}</p>)}

      <button onClick={handleAddGame}>+ Add a game</button>

      <Modal show={show} setShow={setShow}>
        <AddGame />
      </Modal>
    </section>
  );

  function handleAddGame() {
    if (!isLoggedIn) {
      navigate("/auth");
    } else {
      setShow(true);
    }
  }

  function fetchData() {
    setIsFetching(true);

    getBacklog({ userId: "6669dc93263696f42059de2e", status })
      .then((res) => res.data)
      .then((data) => {
        setGames(data.games);
        setIsFetching(false);
      });
  }
}

export default List;
