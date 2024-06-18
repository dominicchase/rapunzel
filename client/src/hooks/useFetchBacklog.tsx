// src/hooks/useFetchBacklog.ts

import { useState, useEffect } from "react";
import { getBacklog } from "../api/POST";
import { Backlog, Status } from "../types/Backlog.types";

const useFetchBacklog = (userId: string | null, status: Status) => {
  const [games, setGames] = useState<Backlog[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsFetching(true);

      fetchBacklog();
    }
  }, [userId, status]);

  function fetchBacklog() {
    getBacklog({ userId: userId as string, status })
      .then((res) => res.data)
      .then((data) => {
        setGames(data.games);
        setIsFetching(false);
      });
  }

  function refetch() {
    if (userId) {
      setIsFetching(true);

      fetchBacklog();
    }
  }

  return { games, isFetching, refetch };
};

export default useFetchBacklog;
