import { queryOptions, useQuery } from "@tanstack/react-query";

import { getAssignees } from "@/api/assignees";
import { createOptimisticId } from "@/hooks/utils";

import type { Assignee, CreateAssigneePayload } from "@/types/assignees";

export const assigneeQueryKeys = {
  all: ["assignees"],
  list: () => [...assigneeQueryKeys.all, "list"],
  details: () => [...assigneeQueryKeys.all, "detail"],
  detail: (assigneeId: Assignee["id"]) => [
    ...assigneeQueryKeys.details(),
    assigneeId,
  ],
};

export const assigneeListOptions = queryOptions({
  queryKey: assigneeQueryKeys.list(),
  queryFn: ({ signal }) => getAssignees(signal),
});

export function useAssignees() {
  return useQuery(assigneeListOptions);
}

export function createOptimisticAssignee(
  payload: CreateAssigneePayload,
): Assignee {
  return {
    id: createOptimisticId(),
    ...payload,
  };
}

export function sortAssigneesByName(assignees: Assignee[]) {
  return [...assignees].sort((firstAssignee, secondAssignee) =>
    firstAssignee.name.localeCompare(secondAssignee.name),
  );
}
