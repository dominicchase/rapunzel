import { useState, useEffect } from "react";
import { getBacklog } from "../api/POST";
import { Backlog, Status } from "../types/Backlog.types";

interface BacklogResponse {
  games: Backlog[];
  totalItems: number;
  totalPages: number;
}

const useFetchBacklog = (
  userId: string | null,
  status: Status,
  page: number
) => {
  const [games, setGames] = useState<Backlog[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userId) {
      setIsFetching(true);
      fetchBacklog(page);
    }
  }, [userId, status, page]);

  function fetchBacklog(page: number) {
    getBacklog({ userId: userId as string, status, page })
      .then((res) => res.data as BacklogResponse)
      .then((data) => {
        setGames((prevGames) => [...prevGames, ...data.games]);
        setIsFetching(false);
        if (data.games.length === 0 || data.games.length < 10) {
          setHasMore(false);
        }
      });
  }

  return { games, isFetching, hasMore };
};

export default useFetchBacklog;
