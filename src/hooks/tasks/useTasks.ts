import {
  queryOptions,
  useInfiniteQuery,
  useQuery,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";

import { getTasks } from "@/api/tasks";
import { createOptimisticId } from "@/hooks/utils";

import type {
  CreateTaskPayload,
  Task,
  TaskQueryParams,
  TasksResponse,
} from "@/types/tasks";

const EMPTY_TASK_PARAMS: TaskQueryParams = {};

export const taskQueryKeys = {
  all: ["tasks"],
  lists: () => [...taskQueryKeys.all, "list"],
  list: (params: TaskQueryParams = EMPTY_TASK_PARAMS) => [
    ...taskQueryKeys.lists(),
    params,
  ],
  infiniteLists: () => [...taskQueryKeys.all, "infinite-list"],
  infiniteList: (params: TaskQueryParams = EMPTY_TASK_PARAMS) => [
    ...taskQueryKeys.infiniteLists(),
    params,
  ],
  details: () => [...taskQueryKeys.all, "detail"],
  detail: (taskId: Task["id"]) => [...taskQueryKeys.details(), taskId],
};

export type TaskListsSnapshot = Array<[QueryKey, TasksResponse | undefined]>;

export function taskListOptions(params: TaskQueryParams = EMPTY_TASK_PARAMS) {
  return queryOptions({
    queryKey: taskQueryKeys.list(params),
    queryFn: ({ signal }) => getTasks(params, signal),
  });
}

export function useTasks(params: TaskQueryParams = EMPTY_TASK_PARAMS) {
  return useQuery(taskListOptions(params));
}

export function useInfiniteTasks(params: TaskQueryParams = EMPTY_TASK_PARAMS) {
  return useInfiniteQuery({
    queryKey: taskQueryKeys.infiniteList(params),
    queryFn: ({ pageParam, signal }) =>
      getTasks(
        {
          ...params,
          page: pageParam,
        },
        signal,
      ),
    initialPageParam: params.page ?? 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loadedTasks = allPages.reduce(
        (loadedCount, page) => loadedCount + page.data.length,
        0,
      );

      return loadedTasks < lastPage.items ? lastPageParam + 1 : undefined;
    },
  });
}

export function getTaskListParams(
  queryKey: QueryKey,
): TaskQueryParams | undefined {
  if (queryKey[0] !== "tasks" || queryKey[1] !== "list") {
    return undefined;
  }

  const params = queryKey[2];

  if (!params || typeof params !== "object") {
    return EMPTY_TASK_PARAMS;
  }

  return params as TaskQueryParams;
}

export function createOptimisticTask(payload: CreateTaskPayload): Task {
  return {
    id: createOptimisticId(),
    ...payload,
  };
}

export function findCachedTask(
  queryClient: QueryClient,
  taskId: Task["id"],
): Task | undefined {
  const taskDetails = queryClient.getQueryData<Task>(
    taskQueryKeys.detail(taskId),
  );

  if (taskDetails) {
    return taskDetails;
  }

  const taskLists = queryClient.getQueriesData<TasksResponse>({
    queryKey: taskQueryKeys.lists(),
  });

  for (const [, taskList] of taskLists) {
    const cachedTask = taskList?.data.find((task) => task.id === taskId);

    if (cachedTask) {
      return cachedTask;
    }
  }

  return undefined;
}

export function setTaskListCaches(
  queryClient: QueryClient,
  updater: (
    currentTasks: TasksResponse | undefined,
    params: TaskQueryParams,
  ) => TasksResponse | undefined,
) {
  const taskLists = queryClient.getQueriesData<TasksResponse>({
    queryKey: taskQueryKeys.lists(),
  });

  taskLists.forEach(([queryKey, currentTasks]) => {
    queryClient.setQueryData<TasksResponse>(
      queryKey,
      updater(currentTasks, getTaskListParams(queryKey) ?? EMPTY_TASK_PARAMS),
    );
  });
}

export function restoreTaskListCaches(
  queryClient: QueryClient,
  snapshot: TaskListsSnapshot | undefined,
) {
  snapshot?.forEach(([queryKey, taskList]) => {
    queryClient.setQueryData<TasksResponse>(queryKey, taskList);
  });
}

export function addTaskToResponse(
  currentTasks: TasksResponse | undefined,
  task: Task,
  params: TaskQueryParams,
): TasksResponse | undefined {
  if (!currentTasks || !taskMatchesParams(task, params)) {
    return currentTasks;
  }

  if (currentTasks.data.some((currentTask) => currentTask.id === task.id)) {
    return currentTasks;
  }

  return {
    ...currentTasks,
    data: sortTasksByOrder([...currentTasks.data, task]),
    items: currentTasks.items + 1,
  };
}

export function updateTaskInResponse(
  currentTasks: TasksResponse | undefined,
  task: Task,
  params: TaskQueryParams,
  previousTask?: Task,
): TasksResponse | undefined {
  if (!currentTasks) {
    return currentTasks;
  }

  const existsInCurrentPage = currentTasks.data.some(
    (currentTask) => currentTask.id === task.id,
  );
  const matchedBefore = previousTask
    ? taskMatchesParams(previousTask, params)
    : existsInCurrentPage;
  const matchesAfter = taskMatchesParams(task, params);

  if (!existsInCurrentPage && !matchedBefore && !matchesAfter) {
    return currentTasks;
  }

  const withoutTask = currentTasks.data.filter(
    (currentTask) => currentTask.id !== task.id,
  );
  const data = matchesAfter ? [...withoutTask, task] : withoutTask;
  const itemDelta = getTaskItemDelta(matchedBefore, matchesAfter);

  return {
    ...currentTasks,
    data: sortTasksByOrder(data),
    items: Math.max(0, currentTasks.items + itemDelta),
  };
}

export function removeTaskFromResponse(
  currentTasks: TasksResponse | undefined,
  taskId: Task["id"],
  params: TaskQueryParams,
  deletedTask?: Task,
): TasksResponse | undefined {
  if (!currentTasks) {
    return currentTasks;
  }

  const existsInCurrentPage = currentTasks.data.some(
    (task) => task.id === taskId,
  );
  const matchesCurrentParams = deletedTask
    ? taskMatchesParams(deletedTask, params)
    : existsInCurrentPage;

  if (!existsInCurrentPage && !matchesCurrentParams) {
    return currentTasks;
  }

  return {
    ...currentTasks,
    data: currentTasks.data.filter((task) => task.id !== taskId),
    items: matchesCurrentParams
      ? Math.max(0, currentTasks.items - 1)
      : currentTasks.items,
  };
}

function taskMatchesParams(task: Task, params: TaskQueryParams) {
  const search = params.search?.trim().toLowerCase();

  if (params.columnId && task.columnId !== params.columnId) {
    return false;
  }

  if (params.priorities?.length && !params.priorities.includes(task.priority)) {
    return false;
  }

  if (!search) {
    return true;
  }

  return (
    task.title.toLowerCase().includes(search) ||
    task.description.toLowerCase().includes(search)
  );
}

function sortTasksByOrder(tasks: Task[]) {
  return [...tasks].sort(
    (firstTask, secondTask) =>
      firstTask.order - secondTask.order ||
      firstTask.title.localeCompare(secondTask.title),
  );
}

function getTaskItemDelta(matchedBefore: boolean, matchesAfter: boolean) {
  if (matchedBefore && !matchesAfter) {
    return -1;
  }

  if (!matchedBefore && matchesAfter) {
    return 1;
  }

  return 0;
}
