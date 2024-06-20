import List from "./List";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Status } from "../types/Backlog.types";

function Backlog() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="d-flex justify-content-start gap-3">
        {[
          { status: Status.NOT_STARTED },
          { status: Status.IN_PROGRESS },
          { status: Status.COMPLETED },
        ].map((element) => (
          <List key={element.status} status={element.status} />
        ))}
      </div>
    </DndProvider>
  );
}

export default Backlog;
