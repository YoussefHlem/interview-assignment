import { queryOptions, useQuery } from "@tanstack/react-query";

import { getColumns } from "@/api/columns";
import { createOptimisticId } from "@/hooks/utils";

import type { BoardColumn, CreateColumnPayload } from "@/types/columns";

export const columnQueryKeys = {
  all: ["columns"],
  list: () => [...columnQueryKeys.all, "list"],
  details: () => [...columnQueryKeys.all, "detail"],
  detail: (columnId: BoardColumn["id"]) => [
    ...columnQueryKeys.details(),
    columnId,
  ],
};

export const columnListOptions = queryOptions({
  queryKey: columnQueryKeys.list(),
  queryFn: ({ signal }) => getColumns(signal),
});

export function useColumns() {
  return useQuery(columnListOptions);
}

export function createOptimisticColumn(
  payload: CreateColumnPayload,
): BoardColumn {
  return {
    id: createOptimisticId(),
    ...payload,
  };
}

export function sortColumnsByOrder(columns: BoardColumn[]) {
  return [...columns].sort(
    (firstColumn, secondColumn) =>
      firstColumn.order - secondColumn.order ||
      firstColumn.title.localeCompare(secondColumn.title),
  );
}
