import apiClient from "@/api/client";

import type {
  Assignee,
  CreateAssigneePayload,
  UpdateAssigneePayload,
} from "@/types/assignees";

export async function getAssignees(signal?: AbortSignal): Promise<Assignee[]> {
  const response = await apiClient.get<Assignee[]>("/assignees", {
    params: {
      _sort: "name",
    },
    signal,
  });

  return response.data;
}

export async function getAssignee(
  assigneeId: Assignee["id"],
  signal?: AbortSignal,
): Promise<Assignee> {
  const response = await apiClient.get<Assignee>(
    `/assignees/${assigneeId}`,
    { signal },
  );

  return response.data;
}

export async function createAssignee(
  payload: CreateAssigneePayload,
): Promise<Assignee> {
  const response = await apiClient.post<Assignee>("/assignees", payload);

  return response.data;
}

export async function updateAssignee(
  assigneeId: Assignee["id"],
  payload: UpdateAssigneePayload,
): Promise<Assignee> {
  const response = await apiClient.patch<Assignee>(
    `/assignees/${assigneeId}`,
    payload,
  );

  return response.data;
}

export async function deleteAssignee(
  assigneeId: Assignee["id"],
): Promise<Assignee> {
  const response = await apiClient.delete<Assignee>(`/assignees/${assigneeId}`);

  return response.data;
}
