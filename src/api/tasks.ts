import apiClient from "@/api/client";

import { buildTaskQueryParams } from "@/api/utils";

import type {
  CreateTaskPayload,
  Task,
  TaskQueryParams,
  TasksResponse,
  UpdateTaskPayload,
} from "@/types/tasks";

export async function getTasks(
  params: TaskQueryParams = {},
): Promise<TasksResponse> {
  const response = await apiClient.get<TasksResponse>("/tasks", {
    params: buildTaskQueryParams(params),
  });

  return response.data;
}

export async function getTask(taskId: Task["id"]): Promise<Task> {
  const response = await apiClient.get<Task>(`/tasks/${taskId}`);

  return response.data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await apiClient.post<Task>("/tasks", payload);

  return response.data;
}

export async function updateTask(
  taskId: Task["id"],
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await apiClient.patch<Task>(`/tasks/${taskId}`, payload);

  return response.data;
}

export async function moveTask(
  taskId: Task["id"],
  payload: Pick<Task, "columnId" | "order">,
): Promise<Task> {
  return updateTask(taskId, payload);
}

export async function deleteTask(taskId: Task["id"]): Promise<Task> {
  const response = await apiClient.delete<Task>(`/tasks/${taskId}`);

  return response.data;
}
