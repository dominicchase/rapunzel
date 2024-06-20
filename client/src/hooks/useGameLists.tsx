import { useReducer } from "react";
import useFetchBacklog from "./useFetchBacklog";
import { Action, Backlog, Status } from "../types/Backlog.types";
import { updateBacklog } from "../api/PATCH";

export type List = {
  games: Backlog[];
  status: Status;
  page: number;
};

const initialState: List[] = [
  { games: [], status: Status.NOT_STARTED, page: 0 },
  { games: [], status: Status.IN_PROGRESS, page: 0 },
  { games: [], status: Status.COMPLETED, page: 0 },
];

const reducer = (state: List[], action: Action): List[] => {
  switch (action.type) {
    case "GET_BACKLOG": {
      return state.map((list) =>
        list.status === action.status
          ? {
              ...list,
              games: action.backlog,
              page: action.page,
            }
          : list
      );
    }

    case "ADD_GAME": {
      // Implement add game logic here
      return state;
    }

    case "REMOVE_GAME": {
      // Implement remove game logic here
      return state;
    }

    case "UPDATE_BACKLOG": {
      updateAction(action.gameId, action.status);
      return state;
    }

    case "SET_PAGE": {
      // Implement remove game logic here
      return state;
    }

    default:
      return state;
  }
};

const useGameLists = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useFetchBacklog(Status.NOT_STARTED, initialState[0].page, dispatch);

  useFetchBacklog(Status.IN_PROGRESS, initialState[1].page, dispatch);

  useFetchBacklog(Status.COMPLETED, initialState[2].page, dispatch);

  return { state, dispatch };
};

async function updateAction(gameId: number, status: Status) {
  const response = await updateBacklog({ gameId, status });

  if (response.status === 200) {
    console.log(response, response.status);
  } else {
    console.log("error");
  }
}

export default useGameLists;
