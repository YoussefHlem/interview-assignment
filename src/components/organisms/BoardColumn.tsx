import { useMemo, type HTMLAttributes } from "react";

import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";

import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";

import {
  COLUMN_DND_GROUP,
  COLUMN_DND_TYPE,
  getColumnDndId,
  getTaskDropDndId,
  hasSelectedAssignee,
  TASK_DND_TYPE,
  TASK_DROP_DND_TYPE,
  type ColumnDndData,
  type TaskDropDndData,
} from "@/components/dnd/boardDnd";

import { ColumnFooter } from "@/components/organisms/ColumnFooter";
import { ColumnHeader } from "@/components/organisms/ColumnHeader";
import { TaskList } from "@/components/organisms/TaskList";

import { useInfiniteTasks } from "@/hooks/tasks/useTasks";

import type { Assignee } from "@/types/assignees";
import type { BoardColumn as BoardColumnType } from "@/types/columns";
import type { Task, TaskQueryParams } from "@/types/tasks";

export interface BoardColumnProps {
  assignees: Assignee[];
  column: BoardColumnType;
  columnIndex: number;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
  onAddTask?: (column: BoardColumnType) => void;
  onDeleteColumn?: (column: BoardColumnType) => void;
  onDeleteTask?: (task: Task) => void;
  onEditColumn?: (column: BoardColumnType) => void;
  onEditTask?: (task: Task) => void;
  selectedAssigneeIds?: Assignee["id"][];
  sx?: SxProps<Theme>;
  taskQueryParams?: TaskQueryParams;
}

export function BoardColumn({
  assignees,
  column,
  columnIndex,
  dragHandleProps,
  onAddTask,
  onDeleteColumn,
  onDeleteTask,
  onEditColumn,
  onEditTask,
  selectedAssigneeIds = [],
  sx,
  taskQueryParams = {},
}: BoardColumnProps) {
  const columnTaskQueryParams = useMemo<TaskQueryParams>(
    () => ({
      ...taskQueryParams,
      columnId: column.id,
    }),
    [column.id, taskQueryParams],
  );
  const tasksQuery = useInfiniteTasks(columnTaskQueryParams);
  const loadedTasks = useMemo(
    () => tasksQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [tasksQuery.data?.pages],
  );
  const visibleTasks = useMemo(() => {
    return loadedTasks.filter((task) =>
      hasSelectedAssignee(task, selectedAssigneeIds),
    );
  }, [loadedTasks, selectedAssigneeIds]);
  const totalColumnTasks =
    tasksQuery.data?.pages[0]?.items ?? loadedTasks.length;
  const taskCount =
    selectedAssigneeIds.length > 0 ? visibleTasks.length : totalColumnTasks;
  const lastVisibleTaskOrder = visibleTasks[visibleTasks.length - 1]?.order;
  const columnDndData: ColumnDndData = {
    column,
    index: columnIndex,
    kind: "column",
  };
  const taskDropDndData: TaskDropDndData = {
    columnId: column.id,
    kind: "task-drop",
    previousOrder: lastVisibleTaskOrder,
  };
  const {
    handleRef: columnHandleRef,
    isDragging,
    isDropTarget: isColumnDropTarget,
    ref: columnRef,
  } = useSortable<ColumnDndData>({
    accept: COLUMN_DND_TYPE,
    data: columnDndData,
    group: COLUMN_DND_GROUP,
    id: getColumnDndId(column.id),
    index: columnIndex,
    type: COLUMN_DND_TYPE,
  });
  const { isDropTarget: isTaskDropTarget, ref: taskDropRef } =
    useDroppable<TaskDropDndData>({
      accept: TASK_DND_TYPE,
      data: taskDropDndData,
      id: getTaskDropDndId(column.id),
      type: TASK_DROP_DND_TYPE,
    });

  return (
    <Paper
      component="section"
      elevation={0}
      ref={columnRef}
      sx={[
        {
          bgcolor: "#e9f7f5",
          border: 0,
          borderRadius: 1.5,
          display: "flex",
          flexDirection: "column",
          height: "85dvh",
          maxHeight: "100%",
          minHeight: 0,
          minWidth: { xs: "calc(100vw - 32px)", sm: 400 },
          opacity: isDragging ? 0.55 : 1,
          overflow: "hidden",
          outline: isColumnDropTarget ? "2px solid #8bc2c6" : "none",
          outlineOffset: 2,
          width: { xs: "calc(100vw - 32px)", sm: 400 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant="outlined"
    >
      <ColumnHeader
        column={column}
        dragHandleRef={columnHandleRef}
        dragHandleProps={dragHandleProps}
        onDelete={onDeleteColumn}
        onEdit={onEditColumn}
        taskCount={taskCount}
      />
      <TaskList
        assignees={assignees}
        hasMoreTasks={tasksQuery.hasNextPage}
        isFetchingMore={tasksQuery.isFetchingNextPage}
        isLoading={tasksQuery.isLoading}
        onLoadMore={() => {
          void tasksQuery.fetchNextPage();
        }}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        rootRef={taskDropRef}
        sx={{
          bgcolor: isTaskDropTarget ? "rgba(139, 194, 198, 0.18)" : undefined,
          transition: "background-color 160ms ease",
        }}
        tasks={visibleTasks}
      />
      <ColumnFooter
        onAddTask={onAddTask ? () => onAddTask(column) : undefined}
      />
    </Paper>
  );
}
