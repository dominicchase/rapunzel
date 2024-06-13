import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Game } from "../types/Games.types";
import Modal from "./Modal";
import AddGame from "./AddGame";

type Props = {
  title: string;
  games: Game[];
};

function List({ title, games }: Props) {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  // TODO: extract this and handle refreshToken logic
  const isLoggedIn = localStorage.getItem("accessToken");

  return (
    <section>
      <h5 className="text-start">{title}</h5>
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
}

export default List;
