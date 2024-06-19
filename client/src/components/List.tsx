// src/components/List.tsx

import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AddGame from "./AddGame";
import useAuth from "../hooks/useAuth";
import useFetchBacklog from "../hooks/useFetchBacklog";
import { Status } from "../types/Backlog.types";
import { addToBacklog } from "../api/POST";
import { Game } from "./Game";

type Props = {
  title: string;
  status: Status;
};

const List: React.FC<Props> = ({ title, status }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();

  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);

  const { games, isFetching, hasMore } = useFetchBacklog(userId, status, page);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastGameElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  console.log({ games, isFetching, page });

  if (isFetching && page === 0) return null;

  return (
    <div className="container">
      <section className="backlog-card">
        <h5 className="text-start mb-4">{title}</h5>

        <div className="game-column">
          {games.map((game, index) => (
            <div
              key={game.id}
              ref={games.length === index + 1 ? lastGameElementRef : null}
            >
              <Game game={game} />
            </div>
          ))}

          {isFetching && <p>Loading...</p>}
        </div>

        <button className="btn-no-bg" onClick={handleAddGameModal}>
          + Add a game
        </button>

        <Modal show={show} setShow={setShow}>
          <AddGame handleAddGame={handleAddGame} />
        </Modal>
      </section>
    </div>
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
    });
  }
};

export default List;
