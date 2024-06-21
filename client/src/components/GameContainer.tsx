import { useEffect, useRef, useState } from "react";
import { QueryKey, useQueryClient } from "react-query";
import { DropTargetMonitor, XYCoord, useDrop } from "react-dnd";

import { Game } from "./Game";

import { useBacklogMutations } from "../api/queries/backlogMutations";

import {
  Backlog,
  GetBacklogResponseBody,
  Status,
} from "../types/Backlog.types";

type Props = {
  backlog: Backlog[];
  status: Status;
};

export function GameContainer({ backlog, status }: Props) {
  const queryClient = useQueryClient();
  const { updateBacklogMutation } = useBacklogMutations();

  const ref = useRef<HTMLDivElement | null>(null);
  const [draggedItem, setDraggedItem] = useState<Backlog | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "GAME",
    drop: (game: Backlog) => handleDrop(game),
    hover: (_, monitor: DropTargetMonitor<Backlog, void>) =>
      handleHover(monitor),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!isOver) {
      setPlaceholderIndex(null);
    }
  }, [isOver]);

  return (
    <div className="game-column" ref={handleRef}>
      {backlog.map((game, index) => (
        <div key={game.id}>
          {index === placeholderIndex && <Placeholder />}
          <Game game={game} setDraggedItem={setDraggedItem} />
        </div>
      ))}
    </div>
  );

  function handleRef(node: HTMLDivElement | null) {
    drop(node);
    ref.current = node;
  }

  function handleDrop(game: Backlog) {
    if (placeholderIndex === null) {
      return;
    }

    const differentStatus = game.status !== status;
    const differentPosition = game.position !== placeholderIndex;

    if (differentStatus || differentPosition) {
      console.log("here");
      updateBacklogMutation.mutate(
        {
          gameId: game.id,
          position: placeholderIndex,
          status,
        },
        { onSuccess: () => modifyQueryData(game) }
      );

      setPlaceholderIndex(null);
    }
  }

  function modifyQueryData(game: Backlog) {
    if (game.status === status) {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      const backlogQueries = queries
        .filter((query) => query.queryKey[0] === status)
        .map((query) => query.queryKey);

      const QK = backlogQueries.find((query) => query[0] === status);

      const prevData = queryClient.getQueryData<GetBacklogResponseBody>(
        QK as QueryKey
      );

      if (!prevData || placeholderIndex === null) {
        return;
      }

      const cpy = [...prevData.backlog];

      console.log(game.position);

      // remove game from its current position
      cpy.splice(game.position, 1);

      // insert game at the provided position
      prevData.backlog.splice(placeholderIndex, 0, game);

      // rebuild positions for all games in userBacklog
      const rebuiltBacklog = prevData.backlog.map((game, index) => ({
        ...game,
        position: index,
        status,
      }));

      // queryClient.setQueryData(QK as QueryKey, {
      //   ...prevData,
      //   backlog: rebuiltBacklog,
      // });
    }

    const { PREV_QK, NEXT_QK } = getFullQueryKeys(game.status, status);

    if (!PREV_QK || !NEXT_QK) {
      return;
    }

    const prevData = queryClient.getQueryData<GetBacklogResponseBody>(PREV_QK);
    const nextData = queryClient.getQueryData<GetBacklogResponseBody>(NEXT_QK);

    if (!prevData || !nextData) {
      return;
    }

    const filteredBacklog = prevData.backlog.filter(({ id }) => id !== game.id);

    queryClient.setQueryData<GetBacklogResponseBody>(PREV_QK, {
      backlog: filteredBacklog,
      totalItems: prevData.totalItems - 1,
      totalPages: Math.floor((prevData.totalPages * 10 - 1) / 10) || 1,
    });

    const { backlog: nextBacklog } = nextData;

    if (!nextBacklog) {
      return;
    }

    // // insert game at the provided position
    nextBacklog.splice(game.position, 0, { ...game, status });

    // // rebuild positions for all games in backlog
    const rebuiltBacklog = nextBacklog.map((game, index) => ({
      ...game,
      position: index,
    }));

    queryClient.setQueryData<GetBacklogResponseBody>(NEXT_QK, {
      backlog: rebuiltBacklog,
      totalItems: nextData.totalItems + 1,
      totalPages: Math.floor((prevData.totalPages * 10 + 1) / 10) || 1,
    });
  }

  function getFullQueryKeys(prevStatus: Status, nextStatus: Status) {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    const backlogQueries = queries
      .filter(
        (query) =>
          query.queryKey[0] === prevStatus || query.queryKey[0] === nextStatus
      )
      .map((query) => query.queryKey);

    const PREV_QK = backlogQueries.find((query) => query[0] === prevStatus);
    const NEXT_QK = backlogQueries.find((query) => query[0] === nextStatus);

    return { PREV_QK, NEXT_QK };
  }

  function handleHover(monitor: DropTargetMonitor<Backlog, void>) {
    if (ref.current && backlog) {
      const hoverIndex = calculateHoverIndex(
        monitor.getClientOffset(),
        ref.current,
        backlog.length
      );

      setPlaceholderIndex(hoverIndex);
    }
  }

  function calculateHoverIndex(
    clientOffset: XYCoord | null,
    container: HTMLElement,
    length: number
  ) {
    if (!clientOffset) {
      return null;
    }

    const hoverY = clientOffset.y - container.getBoundingClientRect().top;
    const itemHeight = container.scrollHeight / length;

    return Math.floor(hoverY / itemHeight);
  }
}

function Placeholder() {
  return <div className="placeholder" />;
}
