// src/components/List.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AddGame from "./AddGame";
import useAuth from "../hooks/useAuth";
import useFetchBacklog from "../hooks/useFetchBacklog";
import { Status } from "../types/Backlog.types";
import { addToBacklog } from "../api/POST";

type Props = {
  title: string;
  status: Status;
};

const List: React.FC<Props> = ({ title, status }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();

  const [show, setShow] = useState(false);

  const { games, isFetching, refetch } = useFetchBacklog(userId, status);

  if (isFetching) return null;

  return (
    <section>
      <h5 className="text-start">{title}</h5>

      {games.length > 0 &&
        games.map((game) => <p key={game.id}>{game.name}</p>)}

      <button onClick={handleAddGameModal}>+ Add a game</button>

      <Modal show={show} setShow={setShow}>
        <AddGame handleAddGame={handleAddGame} />
      </Modal>
    </section>
  );

  function handleAddGameModal() {
    if (isAuthenticated) {
      setShow(true);
    } else {
      navigate("/auth");
    }
  }

  function handleAddGame(gameId: number) {
    addToBacklog({
      userId: userId as string,
      gameId,
      status,
    }).then(() => {
      setShow(false);
      refetch();
    });
  }
};

export default List;
