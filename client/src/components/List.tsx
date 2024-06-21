import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { DropTargetMonitor, XYCoord, useDrop } from "react-dnd";
import { GameContainer } from "./GameContainer";
import { useBacklogQuery } from "../api/queries/backlogQueries";
import {
  Backlog,
  GetBacklogResponseBody,
  Status,
} from "../types/Backlog.types";
import { useBacklogMutations } from "../api/queries/backlogMutations";

type Props = {
  status: Status;
};

const List: React.FC<Props> = ({ status }) => {
  const queryClient = useQueryClient();
  const { updateBacklogMutation } = useBacklogMutations();

  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(0);
  const { data, isFetching } = useBacklogQuery({ status, page });

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
    <div className="backlog-card col-4" ref={handleRef}>
      <h5 className="text-start mb-4">{getUserFriendlyTitle(status)}</h5>

      {!data || isFetching ? (
        "Loading..."
      ) : (
        <GameContainer
          backlog={data.backlog}
          placeholderIndex={placeholderIndex}
        />
      )}
    </div>
  );

  function handleRef(node: HTMLDivElement | null) {
    drop(node);
    ref.current = node;
  }

  function handleDrop(game: Backlog) {
    if (game !== null && placeholderIndex !== null) {
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
    if (ref.current && data) {
      const hoverIndex = calculateHoverIndex(
        monitor.getClientOffset(),
        ref.current,
        data.backlog.length
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
