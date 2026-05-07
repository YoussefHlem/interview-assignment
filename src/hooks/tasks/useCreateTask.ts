import { useMutation } from "@tanstack/react-query";

import { createTask } from "@/api/tasks";

import {
  addTaskToResponse,
  createOptimisticTask,
  restoreTaskListCaches,
  setTaskListCaches,
  taskQueryKeys,
} from "@/hooks/tasks/useTasks";

import type { CreateTaskPayload, TasksResponse } from "@/types/tasks";
import type { TaskListsSnapshot } from "@/hooks/tasks/useTasks";

export function useCreateTask() {
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: taskQueryKeys.all });

      const previousTaskLists: TaskListsSnapshot =
        context.client.getQueriesData<TasksResponse>({
          queryKey: taskQueryKeys.lists(),
        });
      const optimisticTask = createOptimisticTask(payload);

      setTaskListCaches(context.client, (currentTasks, params) =>
        addTaskToResponse(currentTasks, optimisticTask, params),
      );

      return { previousTaskLists };
    },
    onError: (_error, _payload, onMutateResult, context) => {
      restoreTaskListCaches(context.client, onMutateResult?.previousTaskLists);
    },
    onSettled: (_data, _error, _payload, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: taskQueryKeys.all }),
  });
}
