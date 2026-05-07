import { useMutation } from "@tanstack/react-query";

import { moveTask } from "@/api/tasks";

import {
  findCachedTask,
  restoreTaskListCaches,
  setTaskListCaches,
  taskQueryKeys,
  updateTaskInResponse,
} from "@/hooks/tasks/useTasks";

import type { Task, TasksResponse } from "@/types/tasks";
import type { TaskListsSnapshot } from "@/hooks/tasks/useTasks";

type MoveTaskVariables = Pick<Task, "columnId" | "order"> & {
  taskId: Task["id"];
};

export function useMoveTask() {
  return useMutation({
    mutationFn: ({ taskId, columnId, order }: MoveTaskVariables) =>
      moveTask(taskId, { columnId, order }),
    onMutate: async ({ taskId, columnId, order }, context) => {
      await context.client.cancelQueries({ queryKey: taskQueryKeys.all });

      const previousTaskLists: TaskListsSnapshot =
        context.client.getQueriesData<TasksResponse>({
          queryKey: taskQueryKeys.lists(),
        });
      const previousTaskDetail = context.client.getQueryData<Task>(
        taskQueryKeys.detail(taskId),
      );
      const previousTask =
        previousTaskDetail ?? findCachedTask(context.client, taskId);
      const optimisticTask = previousTask
        ? {
            ...previousTask,
            columnId,
            order,
          }
        : undefined;

      if (optimisticTask) {
        setTaskListCaches(context.client, (currentTasks, params) =>
          updateTaskInResponse(
            currentTasks,
            optimisticTask,
            params,
            previousTask,
          ),
        );
      }

      if (previousTaskDetail && optimisticTask) {
        context.client.setQueryData<Task>(
          taskQueryKeys.detail(taskId),
          optimisticTask,
        );
      }

      return { previousTaskLists, previousTaskDetail };
    },
    onError: (_error, variables, onMutateResult, context) => {
      restoreTaskListCaches(context.client, onMutateResult?.previousTaskLists);

      if (onMutateResult?.previousTaskDetail) {
        context.client.setQueryData<Task>(
          taskQueryKeys.detail(variables.taskId),
          onMutateResult.previousTaskDetail,
        );
      }
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: taskQueryKeys.all }),
  });
}
