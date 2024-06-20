import { useState, useEffect } from "react";
import { Backlog, Status } from "../types/Backlog.types";
import { getBacklog } from "../api/GET";

interface BacklogResponse {
  backlog: Backlog[];
  totalItems: number;
  totalPages: number;
}

const useFetchBacklog = (
  status: Status,
  page: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>
) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchBacklog();
  }, [status, page]); // Update when status or page changes

  function fetchBacklog() {
    setIsFetching(true);

    getBacklog({ status, page })
      .then((res) => res.data as BacklogResponse)
      .then((data) => {
        dispatch({
          type: "GET_BACKLOG",
          backlog: data.backlog,
          status,
          page,
        });
        setIsFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching backlog:", error);
        setIsFetching(false);
      });
  }

  return { isFetching };
};

export default useFetchBacklog;
