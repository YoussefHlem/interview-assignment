import apiClient from "@/api/client";

import type {
  BoardColumn,
  CreateColumnPayload,
  UpdateColumnPayload,
} from "@/types/columns";

export async function getColumns(): Promise<BoardColumn[]> {
  const response = await apiClient.get<BoardColumn[]>("/columns", {
    params: {
      _sort: "order",
    },
  });

  return response.data;
}

export async function getColumn(
  columnId: BoardColumn["id"],
): Promise<BoardColumn> {
  const response = await apiClient.get<BoardColumn>(`/columns/${columnId}`);

  return response.data;
}

export async function createColumn(
  payload: CreateColumnPayload,
): Promise<BoardColumn> {
  const response = await apiClient.post<BoardColumn>("/columns", payload);

  return response.data;
}

export async function updateColumn(
  columnId: BoardColumn["id"],
  payload: UpdateColumnPayload,
): Promise<BoardColumn> {
  const response = await apiClient.patch<BoardColumn>(
    `/columns/${columnId}`,
    payload,
  );

  return response.data;
}

export async function reorderColumn(
  columnId: BoardColumn["id"],
  order: BoardColumn["order"],
): Promise<BoardColumn> {
  return updateColumn(columnId, { order });
}

export async function deleteColumn(
  columnId: BoardColumn["id"],
): Promise<BoardColumn> {
  const response = await apiClient.delete<BoardColumn>(`/columns/${columnId}`);

  return response.data;
}
