import apiClient from "@/api/client";

import type {
  Assignee,
  CreateAssigneePayload,
  UpdateAssigneePayload,
} from "@/types/assignees";

export async function getAssignees(): Promise<Assignee[]> {
  const response = await apiClient.get<Assignee[]>("/assignees", {
    params: {
      _sort: "name",
    },
  });

  return response.data;
}

export async function getAssignee(
  assigneeId: Assignee["id"],
): Promise<Assignee> {
  const response = await apiClient.get<Assignee>(`/assignees/${assigneeId}`);

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
