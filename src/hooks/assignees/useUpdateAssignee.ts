import { useMutation } from "@tanstack/react-query";

import { updateAssignee } from "@/api/assignees";

import {
  assigneeListOptions,
  assigneeQueryKeys,
  sortAssigneesByName,
} from "@/hooks/assignees/useAssignees";

import type { Assignee, UpdateAssigneePayload } from "@/types/assignees";

type UpdateAssigneeVariables = {
  assigneeId: Assignee["id"];
  payload: UpdateAssigneePayload;
};

export function useUpdateAssignee() {
  return useMutation({
    mutationFn: ({ assigneeId, payload }: UpdateAssigneeVariables) =>
      updateAssignee(assigneeId, payload),
    onMutate: async ({ assigneeId, payload }, context) => {
      await context.client.cancelQueries({ queryKey: assigneeQueryKeys.all });

      const previousAssignees = context.client.getQueryData<Assignee[]>(
        assigneeListOptions.queryKey,
      );
      const previousAssigneeDetail = context.client.getQueryData<Assignee>(
        assigneeQueryKeys.detail(assigneeId),
      );
      const previousAssignee =
        previousAssigneeDetail ??
        previousAssignees?.find((assignee) => assignee.id === assigneeId);
      const optimisticAssignee = previousAssignee
        ? {
            ...previousAssignee,
            ...payload,
          }
        : undefined;

      if (optimisticAssignee) {
        context.client.setQueryData<Assignee[]>(
          assigneeListOptions.queryKey,
          (currentAssignees) =>
            currentAssignees
              ? sortAssigneesByName(
                  currentAssignees.map((assignee) =>
                    assignee.id === assigneeId ? optimisticAssignee : assignee,
                  ),
                )
              : currentAssignees,
        );
      }

      if (previousAssigneeDetail && optimisticAssignee) {
        context.client.setQueryData<Assignee>(
          assigneeQueryKeys.detail(assigneeId),
          optimisticAssignee,
        );
      }

      return { previousAssignees, previousAssigneeDetail };
    },
    onError: (_error, variables, onMutateResult, context) => {
      if (onMutateResult?.previousAssignees) {
        context.client.setQueryData<Assignee[]>(
          assigneeListOptions.queryKey,
          onMutateResult.previousAssignees,
        );
      }

      if (onMutateResult?.previousAssigneeDetail) {
        context.client.setQueryData<Assignee>(
          assigneeQueryKeys.detail(variables.assigneeId),
          onMutateResult.previousAssigneeDetail,
        );
      }
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: assigneeQueryKeys.all }),
  });
}
