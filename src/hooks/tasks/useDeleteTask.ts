import { useMutation } from "@tanstack/react-query";

import { deleteTask } from "@/api/tasks";

import {
  findCachedTask,
  removeTaskFromResponse,
  restoreTaskListCaches,
  setTaskListCaches,
  taskQueryKeys,
} from "@/hooks/tasks/useTasks";

import type { Task, TasksResponse } from "@/types/tasks";
import type { TaskListsSnapshot } from "@/hooks/tasks/useTasks";

export function useDeleteTask() {
  return useMutation({
    mutationFn: (taskId: Task["id"]) => deleteTask(taskId),
    onMutate: async (taskId, context) => {
      await context.client.cancelQueries({ queryKey: taskQueryKeys.all });

      const previousTaskLists: TaskListsSnapshot =
        context.client.getQueriesData<TasksResponse>({
          queryKey: taskQueryKeys.lists(),
        });
      const previousTaskDetail = context.client.getQueryData<Task>(
        taskQueryKeys.detail(taskId),
      );
      const deletedTask =
        previousTaskDetail ?? findCachedTask(context.client, taskId);

      setTaskListCaches(context.client, (currentTasks, params) =>
        removeTaskFromResponse(currentTasks, taskId, params, deletedTask),
      );

      return { previousTaskLists, previousTaskDetail };
    },
    onError: (_error, taskId, onMutateResult, context) => {
      restoreTaskListCaches(context.client, onMutateResult?.previousTaskLists);

      if (onMutateResult?.previousTaskDetail) {
        context.client.setQueryData<Task>(
          taskQueryKeys.detail(taskId),
          onMutateResult.previousTaskDetail,
        );
      }
    },
    onSettled: (_data, _error, _taskId, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: taskQueryKeys.all }),
  });
}
