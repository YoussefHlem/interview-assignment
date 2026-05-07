import { useMutation } from "@tanstack/react-query";

import { reorderColumn } from "@/api/columns";

import {
  columnListOptions,
  columnQueryKeys,
  sortColumnsByOrder,
} from "@/hooks/columns/useColumns";

import type { BoardColumn } from "@/types/columns";

type MoveColumnVariables = Pick<BoardColumn, "order"> & {
  columnId: BoardColumn["id"];
};

export function useMoveColumn() {
  return useMutation({
    mutationFn: ({ columnId, order }: MoveColumnVariables) =>
      reorderColumn(columnId, order),
    onMutate: async ({ columnId, order }, context) => {
      await context.client.cancelQueries({ queryKey: columnQueryKeys.all });

      const previousColumns = context.client.getQueryData<BoardColumn[]>(
        columnListOptions.queryKey,
      );
      const previousColumnDetail = context.client.getQueryData<BoardColumn>(
        columnQueryKeys.detail(columnId),
      );
      const previousColumn =
        previousColumnDetail ??
        previousColumns?.find((column) => column.id === columnId);
      const optimisticColumn = previousColumn
        ? {
            ...previousColumn,
            order,
          }
        : undefined;

      if (optimisticColumn) {
        context.client.setQueryData<BoardColumn[]>(
          columnListOptions.queryKey,
          (currentColumns) =>
            currentColumns
              ? sortColumnsByOrder(
                  currentColumns.map((column) =>
                    column.id === columnId ? optimisticColumn : column,
                  ),
                )
              : currentColumns,
        );
      }

      if (previousColumnDetail && optimisticColumn) {
        context.client.setQueryData<BoardColumn>(
          columnQueryKeys.detail(columnId),
          optimisticColumn,
        );
      }

      return { previousColumns, previousColumnDetail };
    },
    onError: (_error, variables, onMutateResult, context) => {
      if (onMutateResult?.previousColumns) {
        context.client.setQueryData<BoardColumn[]>(
          columnListOptions.queryKey,
          onMutateResult.previousColumns,
        );
      }

      if (onMutateResult?.previousColumnDetail) {
        context.client.setQueryData<BoardColumn>(
          columnQueryKeys.detail(variables.columnId),
          onMutateResult.previousColumnDetail,
        );
      }
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: columnQueryKeys.all }),
  });
}
