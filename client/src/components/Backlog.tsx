import List from "./List";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useGameLists from "../hooks/useGameLists";

function Backlog() {
  const { state, dispatch } = useGameLists();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="d-flex justify-content-start gap-3">
        {state.map((list) => (
          <List key={list.status} list={list} dispatch={dispatch} />
        ))}
      </div>
    </DndProvider>
  );
}

export default Backlog;
