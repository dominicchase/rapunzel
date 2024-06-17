import List from "./List";
import { Status } from "../types/Backlog.types";

function Backlog() {
  return (
    <div className="d-flex justify-content-start gap-3">
      {[
        { title: "Not Started", status: "NOT_STARTED" },
        { title: "In Progress", status: "IN_PROGRESS" },
        { title: "Completed", status: "COMPLETED" },
      ].map((element) => (
        <List
          key={element.title}
          title={element.title}
          status={element.status as Status}
        />
      ))}
    </div>
  );
}

export default Backlog;
