import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { GameContainer } from "./GameContainer";
import { useBacklogQuery } from "../api/queries/backlogQueries";
import { Backlog, Status } from "../types/Backlog.types";
import { useBacklogMutations } from "../api/queries/backlogMutations";

type Props = {
  status: Status;
};

const List: React.FC<Props> = ({ status }) => {
  const [page, setPage] = useState(0);

  const { data, isFetching } = useBacklogQuery({ status, page });
  const { updateBacklogMutation } = useBacklogMutations();

  const [, drop] = useDrop({
    accept: "GAME",
    drop: (game: Backlog) => {
      onDrop(game, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="backlog-card col-4" ref={drop}>
      <h5 className="text-start mb-4">{getUserFriendlyTitle(status)}</h5>

      {!data || isFetching ? (
        "Loading..."
      ) : (
        <GameContainer backlog={data.backlog} />
      )}
    </div>
  );

  function onDrop(game: Backlog, status: Status) {
    const currentStatus = game.status;
    const nextStatus = status;

    if (currentStatus !== nextStatus) {
      updateBacklogMutation.mutate({ gameId: game.id, status: nextStatus });
    }
  }

  function getUserFriendlyTitle(status: Status) {
    switch (status) {
      case Status.NOT_STARTED:
        return "Not Started";

      case Status.IN_PROGRESS:
        return "In Progress";

      default:
        return "Completed";
    }
  }
};

export default List;
