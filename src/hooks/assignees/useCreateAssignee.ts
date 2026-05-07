import { useMutation } from "@tanstack/react-query";

import { createAssignee } from "@/api/assignees";

import {
  assigneeListOptions,
  assigneeQueryKeys,
  createOptimisticAssignee,
  sortAssigneesByName,
} from "@/hooks/assignees/useAssignees";

import type { Assignee, CreateAssigneePayload } from "@/types/assignees";

export function useCreateAssignee() {
  return useMutation({
    mutationFn: (payload: CreateAssigneePayload) => createAssignee(payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: assigneeQueryKeys.all });

      const previousAssignees = context.client.getQueryData<Assignee[]>(
        assigneeListOptions.queryKey,
      );
      const optimisticAssignee = createOptimisticAssignee(payload);

      context.client.setQueryData<Assignee[]>(
        assigneeListOptions.queryKey,
        (currentAssignees) =>
          currentAssignees
            ? sortAssigneesByName([...currentAssignees, optimisticAssignee])
            : currentAssignees,
      );

      return { previousAssignees };
    },
    onError: (_error, _payload, onMutateResult, context) => {
      if (onMutateResult?.previousAssignees) {
        context.client.setQueryData<Assignee[]>(
          assigneeListOptions.queryKey,
          onMutateResult.previousAssignees,
        );
      }
    },
    onSettled: (_data, _error, _payload, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: assigneeQueryKeys.all }),
  });
}
