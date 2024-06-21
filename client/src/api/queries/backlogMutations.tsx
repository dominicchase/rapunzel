import { useMutation } from "react-query";
import { updateBacklog } from "../PATCH";

export const useBacklogMutations = () => {
  const updateBacklogMutation = useMutation(updateBacklog);

  return { updateBacklogMutation };
};
