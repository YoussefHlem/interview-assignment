import { useMutation } from "@tanstack/react-query";

import { deleteAssignee } from "@/api/assignees";

import {
  assigneeListOptions,
  assigneeQueryKeys,
} from "@/hooks/assignees/useAssignees";

import type { Assignee } from "@/types/assignees";

export function useDeleteAssignee() {
  return useMutation({
    mutationFn: (assigneeId: Assignee["id"]) => deleteAssignee(assigneeId),
    onMutate: async (assigneeId, context) => {
      await context.client.cancelQueries({ queryKey: assigneeQueryKeys.all });

      const previousAssignees = context.client.getQueryData<Assignee[]>(
        assigneeListOptions.queryKey,
      );
      const previousAssigneeDetail = context.client.getQueryData<Assignee>(
        assigneeQueryKeys.detail(assigneeId),
      );

      context.client.setQueryData<Assignee[]>(
        assigneeListOptions.queryKey,
        (currentAssignees) =>
          currentAssignees?.filter((assignee) => assignee.id !== assigneeId),
      );

      return { previousAssignees, previousAssigneeDetail };
    },
    onError: (_error, assigneeId, onMutateResult, context) => {
      if (onMutateResult?.previousAssignees) {
        context.client.setQueryData<Assignee[]>(
          assigneeListOptions.queryKey,
          onMutateResult.previousAssignees,
        );
      }

      if (onMutateResult?.previousAssigneeDetail) {
        context.client.setQueryData<Assignee>(
          assigneeQueryKeys.detail(assigneeId),
          onMutateResult.previousAssigneeDetail,
        );
      }
    },
    onSettled: (_data, _error, _assigneeId, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: assigneeQueryKeys.all }),
  });
}
