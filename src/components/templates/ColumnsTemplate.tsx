import type { DragEndEvent } from "@dnd-kit/react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import {
  getColumnOrderBetween,
  getTaskOrderBetween,
  type BoardDndData,
  type TaskDndData,
  type TaskDropDndData,
} from "@/components/dnd/boardDnd";
import { BoardColumn } from "@/components/organisms";
import type { Assignee } from "@/types/assignees";
import type { BoardColumn as BoardColumnType } from "@/types/columns";
import type { Task, TaskQueryParams } from "@/types/tasks";

export interface ColumnsTemplateProps {
  assignees: Assignee[];
  columns: BoardColumnType[];
  hasError?: boolean;
  isLoading?: boolean;
  onAddColumn?: () => void;
  onAddTask?: (column: BoardColumnType) => void;
  onDeleteColumn?: (column: BoardColumnType) => void;
  onDeleteTask?: (task: Task) => void;
  onEditColumn?: (column: BoardColumnType) => void;
  onEditTask?: (task: Task) => void;
  onMoveColumn?: (
    column: BoardColumnType,
    order: BoardColumnType["order"],
  ) => void;
  onMoveTask?: (
    task: Task,
    columnId: BoardColumnType["id"],
    order: Task["order"],
  ) => void;
  selectedAssigneeIds?: Assignee["id"][];
  sx?: SxProps<Theme>;
  taskQueryParams?: TaskQueryParams;
}

function getBoardDndData(data: unknown): BoardDndData | undefined {
  if (!data || typeof data !== "object" || !("kind" in data)) {
    return undefined;
  }

  return data as BoardDndData;
}

export function ColumnsTemplate({
  assignees,
  columns,
  hasError = false,
  isLoading = false,
  onAddColumn,
  onAddTask,
  onDeleteColumn,
  onDeleteTask,
  onEditColumn,
  onEditTask,
  onMoveColumn,
  onMoveTask,
  selectedAssigneeIds = [],
  sx,
  taskQueryParams,
}: ColumnsTemplateProps) {
  const orderedColumns = [...columns].sort(
    (firstColumn, secondColumn) =>
      firstColumn.order - secondColumn.order ||
      firstColumn.title.localeCompare(secondColumn.title),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }

    const sourceData = getBoardDndData(event.operation.source?.data);
    const targetData = getBoardDndData(event.operation.target?.data);

    if (!sourceData || !targetData) {
      return;
    }

    if (sourceData.kind === "column" && targetData.kind === "column") {
      if (!onMoveColumn || sourceData.column.id === targetData.column.id) {
        return;
      }

      const columnsWithoutSource = orderedColumns.filter(
        (column) => column.id !== sourceData.column.id,
      );
      const targetIndex = columnsWithoutSource.findIndex(
        (column) => column.id === targetData.column.id,
      );

      if (targetIndex === -1) {
        return;
      }

      const movingRight = sourceData.index < targetData.index;
      const previousColumn = movingRight
        ? columnsWithoutSource[targetIndex]
        : columnsWithoutSource[targetIndex - 1];
      const nextColumn = movingRight
        ? columnsWithoutSource[targetIndex + 1]
        : columnsWithoutSource[targetIndex];
      const order = getColumnOrderBetween(
        previousColumn?.order,
        nextColumn?.order,
      );

      if (sourceData.column.order !== order) {
        onMoveColumn(sourceData.column, order);
      }

      return;
    }

    if (sourceData.kind !== "task" || !onMoveTask) {
      return;
    }

    const taskTargetData =
      targetData.kind === "task" ? targetData : undefined;
    const taskDropTargetData =
      targetData.kind === "task-drop" ? targetData : undefined;

    if (!taskTargetData && !taskDropTargetData) {
      return;
    }

    const taskMoveTarget = getTaskMoveTarget(
      sourceData,
      taskTargetData,
      taskDropTargetData,
      isSortableOperation(event.operation),
    );

    if (
      sourceData.task.columnId === taskMoveTarget.columnId &&
      sourceData.task.order === taskMoveTarget.order
    ) {
      return;
    }

    onMoveTask(sourceData.task, taskMoveTarget.columnId, taskMoveTarget.order);
  };

  if (hasError) {
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        Could not load the board.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Loading board
        </Typography>
      </Box>
    );
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Box
        aria-label="Board columns"
        sx={[
          {
            display: "flex",
            flex: 1,
            gap: 2,
            minHeight: 0,
            overflowX: "auto",
            overflowY: "hidden",
            pb: 0.5,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {orderedColumns.map((column, index) => (
          <BoardColumn
            assignees={assignees}
            column={column}
            columnIndex={index}
            key={column.id}
            onAddTask={onAddTask}
            onDeleteColumn={onDeleteColumn}
            onDeleteTask={onDeleteTask}
            onEditColumn={onEditColumn}
            onEditTask={onEditTask}
            selectedAssigneeIds={selectedAssigneeIds}
            taskQueryParams={taskQueryParams}
          />
        ))}

        <Button
          color="inherit"
          disabled={!onAddColumn}
          onClick={onAddColumn}
          startIcon={<AddIcon fontSize="small" />}
          sx={{
            alignItems: "center",
            alignSelf: "stretch",
            borderColor: "divider",
            borderRadius: 2,
            borderStyle: "dashed",
            borderWidth: 2,
            color: "text.secondary",
            flexShrink: 0,
            justifyContent: "center",
            minHeight: 280,
            minWidth: 280,
            textTransform: "none",
            width: 300,
            "&:hover": {
              borderStyle: "dashed",
            },
          }}
          type="button"
          variant="outlined"
        >
          Add Column
        </Button>
      </Box>
    </DragDropProvider>
  );
}

function getTaskMoveTarget(
  sourceData: TaskDndData,
  taskTargetData: TaskDndData | undefined,
  taskDropTargetData: TaskDropDndData | undefined,
  isSortableMove: boolean,
) {
  if (!taskTargetData) {
    return {
      columnId: taskDropTargetData?.columnId ?? sourceData.columnId,
      order: getTaskOrderBetween(
        taskDropTargetData?.previousOrder,
        taskDropTargetData?.nextOrder,
      ),
    };
  }

  const isSameColumn = sourceData.columnId === taskTargetData.columnId;
  const movingDown =
    isSameColumn &&
    isSortableMove &&
    sourceData.task.order < taskTargetData.task.order;
  const previousOrder = movingDown
    ? taskTargetData.task.order
    : taskTargetData.previousOrder;
  const nextOrder = movingDown
    ? taskTargetData.nextOrder
    : taskTargetData.task.order;

  return {
    columnId: taskTargetData.columnId,
    order: getTaskOrderBetween(previousOrder, nextOrder),
  };
}
