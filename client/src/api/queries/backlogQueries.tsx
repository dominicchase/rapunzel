import { useQuery } from "react-query";
import { getBacklog } from "../GET";
import { GetBacklogRequestParams } from "../../types/Backlog.types";

export const useBacklogQuery = (params: GetBacklogRequestParams) => {
  return useQuery([params.status, params.page], () => getBacklog(params));
};
