import { useMutation } from "@tanstack/react-query";

import { updateColumn } from "@/api/columns";

import {
  columnListOptions,
  columnQueryKeys,
  sortColumnsByOrder,
} from "@/hooks/columns/useColumns";

import type { BoardColumn, UpdateColumnPayload } from "@/types/columns";

type UpdateColumnVariables = {
  columnId: BoardColumn["id"];
  payload: UpdateColumnPayload;
};

export function useUpdateColumn() {
  return useMutation({
    mutationFn: ({ columnId, payload }: UpdateColumnVariables) =>
      updateColumn(columnId, payload),
    onMutate: async ({ columnId, payload }, context) => {
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
            ...payload,
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
