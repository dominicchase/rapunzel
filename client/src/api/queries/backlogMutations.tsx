import { useMutation, useQueryClient } from "react-query";
import { updateBacklog } from "../PATCH";
import {
  Backlog,
  GetBacklogResponseBody,
  Status,
} from "../../types/Backlog.types";

export const useBacklogMutations = () => {
  const queryClient = useQueryClient();

  const updateBacklogMutation = useMutation(updateBacklog, {
    onSuccess: (data, variables) => {
      const notStartedBacklog = queryClient
        .getQueryData<GetBacklogResponseBody>([Status.NOT_STARTED], {
          exact: false,
        })
        ?.backlog.find((game) => game.id === variables.gameId);

      const inProgressBacklog = queryClient
        .getQueryData<GetBacklogResponseBody>([Status.IN_PROGRESS], {
          exact: false,
        })
        ?.backlog.find((game) => game.id === variables.gameId);

      const completedBacklog = queryClient
        .getQueryData<GetBacklogResponseBody>([Status.COMPLETED], {
          exact: false,
        })
        ?.backlog.find((game) => game.id === variables.gameId);

      const prevStatus = [
        notStartedBacklog,
        inProgressBacklog,
        completedBacklog,
      ].filter((backlog) => !!backlog)[0];

      const prevBacklog = queryClient.getQueryData<GetBacklogResponseBody>(
        [prevStatus?.status],
        {
          exact: false,
        }
      );

      const game = prevBacklog?.backlog.find(
        (game) => game.id === variables.gameId
      );

      queryClient.setQueryData([prevStatus?.status, 0], {
        ...prevBacklog,
        backlog: prevBacklog?.backlog.filter(
          (game) => game.id !== variables.gameId
        ),
      });

      const nextBacklog = queryClient.getQueryData<GetBacklogResponseBody>(
        [variables.status],
        {
          exact: false,
        }
      );

      console.log({
        ...nextBacklog,
        backlog: nextBacklog?.backlog.splice(0, 0, game as Backlog),
      });

      return;
    },
  });

  return { updateBacklogMutation };
};
