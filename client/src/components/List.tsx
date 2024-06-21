import React, { useState } from "react";
import { GameContainer } from "./GameContainer";
import { useBacklogQuery } from "../api/queries/backlogQueries";
import { Status } from "../types/Backlog.types";

type Props = {
  status: Status;
};

const List: React.FC<Props> = ({ status }) => {
  const [page, setPage] = useState(0);
  const { data, isFetching } = useBacklogQuery({ status, page });

  return (
    <div className="backlog-card col-4">
      <h5 className="text-start mb-4">{getUserFriendlyTitle(status)}</h5>

      {!data || isFetching ? (
        "Loading..."
      ) : (
        <GameContainer backlog={data.backlog} status={status} />
      )}
    </div>
  );

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
