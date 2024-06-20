import React from "react";
import { GameContainer } from "./GameContainer";
import { Action, Backlog, Status } from "../types/Backlog.types";
import { useDrop } from "react-dnd";
import { List as ListType } from "../hooks/useGameLists";

type Props = {
  list: ListType;
  dispatch: React.Dispatch<Action>;
};

const List: React.FC<Props> = ({ list, dispatch }) => {
  const [, drop] = useDrop({
    accept: "GAME",
    drop: (game: Backlog) => {
      onDrop(game, list.status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="backlog-card">
      <h5 className="text-start mb-4">{getUserFriendlyTitle(list.status)}</h5>

      <GameContainer games={list.games} drop={drop} />
    </div>
  );

  function onDrop(game: Backlog, status: Status) {
    if (game.status !== status) {
      dispatch({
        type: "UPDATE_BACKLOG",
        gameId: game.id,
        status,
      });
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
