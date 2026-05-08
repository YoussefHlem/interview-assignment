import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { ModalRoot } from "@/components/modals";
import { Header } from "@/components/organisms";
import { BoardTemplate, ColumnsTemplate } from "@/components/templates";

import { useAssignees } from "@/hooks/assignees/useAssignees";
import { useColumns } from "@/hooks/columns/useColumns";
import { useDeleteColumn } from "@/hooks/columns/useDeleteColumn";
import { useMoveColumn } from "@/hooks/columns/useMoveColumn";
import { useDeleteTask } from "@/hooks/tasks/useDeleteTask";
import { useMoveTask } from "@/hooks/tasks/useMoveTask";

import { useFiltersStore } from "@/stores/filtersStore";
import { useModalStore } from "@/stores/modalStore";

import type { Assignee } from "@/types/assignees";
import type { BoardColumn } from "@/types/columns";
import type { TaskQueryParams } from "@/types/tasks";

const EMPTY_ASSIGNEES: Assignee[] = [];
const EMPTY_COLUMNS: BoardColumn[] = [];

export function BoardPage() {
  const { searchQuery, selectedPriorities, selectedAssignees } =
    useFiltersStore(
      useShallow((state) => ({
        searchQuery: state.searchQuery,
        selectedAssignees: state.selectedAssignees,
        selectedPriorities: state.selectedPriorities,
      })),
    );
  const { openColumnModal, openTaskModal } = useModalStore(
    useShallow((state) => ({
      openColumnModal: state.openColumnModal,
      openTaskModal: state.openTaskModal,
    })),
  );

  const taskQueryParams = useMemo<TaskQueryParams>(
    () => ({
      priorities:
        selectedPriorities.length > 0 ? selectedPriorities : undefined,
      assigneeIds: selectedAssignees.length > 0 ? selectedAssignees : undefined,
      search: searchQuery.trim() || undefined,
    }),
    [searchQuery, selectedAssignees, selectedPriorities],
  );

  const columnsQuery = useColumns();
  const assigneesQuery = useAssignees();
  const deleteColumnMutation = useDeleteColumn();
  const deleteTaskMutation = useDeleteTask();
  const moveColumnMutation = useMoveColumn();
  const moveTaskMutation = useMoveTask();

  const columns = columnsQuery.data ?? EMPTY_COLUMNS;
  const assignees = assigneesQuery.data ?? EMPTY_ASSIGNEES;
  const isLoading = columnsQuery.isLoading || assigneesQuery.isLoading;
  const hasError = columnsQuery.isError || assigneesQuery.isError;

  return (
    <>
      <BoardTemplate header={<Header />}>
        <ColumnsTemplate
          assignees={assignees}
          columns={columns}
          hasError={hasError}
          isLoading={isLoading}
          onAddColumn={() => openColumnModal()}
          onAddTask={(column) => openTaskModal(undefined, column.id)}
          onDeleteColumn={(column) => deleteColumnMutation.mutate(column.id)}
          onDeleteTask={(task) => deleteTaskMutation.mutate(task.id)}
          onEditColumn={(column) => openColumnModal(column.id)}
          onEditTask={(task) => openTaskModal(task.id)}
          onMoveColumn={(column, order) =>
            moveColumnMutation.mutate({ columnId: column.id, order })
          }
          onMoveTask={(task, columnId, order) =>
            moveTaskMutation.mutate({ columnId, order, taskId: task.id })
          }
          taskQueryParams={taskQueryParams}
        />
      </BoardTemplate>
      <ModalRoot />
    </>
  );
}
