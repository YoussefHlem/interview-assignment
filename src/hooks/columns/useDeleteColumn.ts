import { useMutation } from "@tanstack/react-query";

import { deleteColumn } from "@/api/columns";

import { columnListOptions, columnQueryKeys } from "@/hooks/columns/useColumns";

import type { BoardColumn } from "@/types/columns";

export function useDeleteColumn() {
  return useMutation({
    mutationFn: (columnId: BoardColumn["id"]) => deleteColumn(columnId),
    onMutate: async (columnId, context) => {
      await context.client.cancelQueries({ queryKey: columnQueryKeys.all });

      const previousColumns = context.client.getQueryData<BoardColumn[]>(
        columnListOptions.queryKey,
      );
      const previousColumnDetail = context.client.getQueryData<BoardColumn>(
        columnQueryKeys.detail(columnId),
      );

      context.client.setQueryData<BoardColumn[]>(
        columnListOptions.queryKey,
        (currentColumns) =>
          currentColumns?.filter((column) => column.id !== columnId),
      );

      return { previousColumns, previousColumnDetail };
    },
    onError: (_error, columnId, onMutateResult, context) => {
      if (onMutateResult?.previousColumns) {
        context.client.setQueryData<BoardColumn[]>(
          columnListOptions.queryKey,
          onMutateResult.previousColumns,
        );
      }

      if (onMutateResult?.previousColumnDetail) {
        context.client.setQueryData<BoardColumn>(
          columnQueryKeys.detail(columnId),
          onMutateResult.previousColumnDetail,
        );
      }
    },
    onSettled: (_data, _error, _columnId, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: columnQueryKeys.all }),
  });
}
