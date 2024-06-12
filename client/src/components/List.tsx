import { useState } from "react";
import { Game } from "../types/Games.types";
import Modal from "./Modal";
import AddGame from "./AddGame";

type Props = {
  title: string;
  games: Game[];
};

function List({ title, games }: Props) {
  const [show, setShow] = useState(false);

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
    setShow(true);
  }
}

export default List;
