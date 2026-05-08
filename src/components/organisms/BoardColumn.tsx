import { useMemo, type HTMLAttributes } from "react";

import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";

import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {
  COLUMN_DND_GROUP,
  COLUMN_DND_TYPE,
  getColumnDndId,
  getTaskDropDndId,
  isTaskDndData,
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
  const totalColumnTasks =
    tasksQuery.data?.pages[0]?.items ?? loadedTasks.length;
  const lastLoadedTaskOrder = loadedTasks[loadedTasks.length - 1]?.order;
  const columnDndData: ColumnDndData = {
    column,
    index: columnIndex,
    kind: "column",
  };
  const taskDropDndData: TaskDropDndData = {
    columnId: column.id,
    kind: "task-drop",
    previousOrder: lastLoadedTaskOrder,
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
      accept: (source) =>
        isTaskDndData(source.data) && source.data.columnId !== column.id,
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
        taskCount={totalColumnTasks}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
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
            bgcolor: isTaskDropTarget
              ? "rgba(139, 194, 198, 0.18)"
              : undefined,
            transition: "background-color 160ms ease",
          }}
          tasks={loadedTasks}
        />

        {isTaskDropTarget && (
          <Box
            aria-hidden="true"
            sx={{
              alignItems: "center",
              backdropFilter: "blur(3px)",
              bgcolor: "rgba(233, 247, 245, 0.86)",
              border: "2px dashed #4d9da4",
              borderRadius: 1.5,
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.55)",
              display: "flex",
              inset: 12,
              justifyContent: "center",
              pointerEvents: "none",
              position: "absolute",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.94)",
                border: "1px solid rgba(77, 157, 164, 0.34)",
                borderRadius: 1,
                boxShadow: "0 14px 32px rgba(38, 58, 77, 0.16)",
                color: "#244653",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxWidth: "calc(100% - 32px)",
                px: 3,
                py: 2.25,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "#dff2ef",
                  border: "1px solid #9ccfcc",
                  borderRadius: "50%",
                  color: "#28757b",
                  display: "flex",
                  height: 44,
                  justifyContent: "center",
                  width: 44,
                }}
              >
                <DriveFileMoveOutlinedIcon fontSize="small" />
              </Box>

              <Typography
                sx={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0,
                  lineHeight: 1.2,
                  textTransform: "uppercase",
                }}
              >
                Move task to
              </Typography>

              <Typography
                sx={{
                  color: "#173640",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 16,
                  fontWeight: 800,
                  lineHeight: 1.35,
                  maxWidth: "100%",
                  overflowWrap: "anywhere",
                }}
              >
                "{column.title}"
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <ColumnFooter
        onAddTask={onAddTask ? () => onAddTask(column) : undefined}
      />
    </Paper>
  );
}
