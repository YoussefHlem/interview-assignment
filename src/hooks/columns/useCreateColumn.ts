import { useMutation } from "@tanstack/react-query";

import { createColumn } from "@/api/columns";

import {
  columnListOptions,
  columnQueryKeys,
  createOptimisticColumn,
  sortColumnsByOrder,
} from "@/hooks/columns/useColumns";

import type { BoardColumn, CreateColumnPayload } from "@/types/columns";

export function useCreateColumn() {
  return useMutation({
    mutationFn: (payload: CreateColumnPayload) => createColumn(payload),
    onMutate: async (payload, context) => {
      await context.client.cancelQueries({ queryKey: columnQueryKeys.all });

      const previousColumns = context.client.getQueryData<BoardColumn[]>(
        columnListOptions.queryKey,
      );
      const optimisticColumn = createOptimisticColumn(payload);

      context.client.setQueryData<BoardColumn[]>(
        columnListOptions.queryKey,
        (currentColumns) =>
          currentColumns
            ? sortColumnsByOrder([...currentColumns, optimisticColumn])
            : currentColumns,
      );

      return { previousColumns };
    },
    onError: (_error, _payload, onMutateResult, context) => {
      if (onMutateResult?.previousColumns) {
        context.client.setQueryData<BoardColumn[]>(
          columnListOptions.queryKey,
          onMutateResult.previousColumns,
        );
      }
    },
    onSettled: (_data, _error, _payload, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: columnQueryKeys.all }),
  });
}
