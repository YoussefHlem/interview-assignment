import type { ReactNode, UIEvent } from "react";

import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { TaskCard } from "@/components/organisms/TaskCard";
import type { Assignee } from "@/types/assignees";
import type { Task } from "@/types/tasks";

export interface TaskListProps {
  assignees: Assignee[];
  emptyState?: ReactNode;
  hasMoreTasks?: boolean;
  isFetchingMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  rootRef?: (element: Element | null) => void;
  sx?: SxProps<Theme>;
  tasks: Task[];
}

export function TaskList({
  assignees,
  emptyState,
  hasMoreTasks = false,
  isFetchingMore = false,
  isLoading = false,
  onLoadMore,
  onDeleteTask,
  onEditTask,
  rootRef,
  sx,
  tasks,
}: TaskListProps) {
  const orderedTasks = [...tasks].sort(
    (firstTask, secondTask) =>
      firstTask.order - secondTask.order ||
      firstTask.title.localeCompare(secondTask.title),
  );
  const handleScroll = (event: UIEvent<HTMLElement>) => {
    if (!hasMoreTasks || isFetchingMore || !onLoadMore) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceToBottom < 180) {
      onLoadMore();
    }
  };

  return (
    <Box
      aria-label="Tasks"
      component="section"
      onScroll={handleScroll}
      ref={rootRef}
      sx={[
        {
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 1.5,
          minHeight: 0,
          overflowY: "auto",
          px: 2,
          py: 0,
          scrollbarColor: "#8f9295 transparent",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 12,
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#8f9295",
            border: "3px solid transparent",
            borderRadius: 999,
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {isLoading && (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: 128,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Loading tasks
          </Typography>
        </Box>
      )}

      {!isLoading &&
        (orderedTasks.length > 0
        ? orderedTasks.map((task, index) => (
            <TaskCard
              assignees={assignees}
              key={task.id}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              sortable={{
                index: index,
                nextOrder: orderedTasks[index + 1]?.order,
                previousOrder: orderedTasks[index - 1]?.order,
              }}
              task={task}
            />
          ))
        : (emptyState ?? (
            <Box
              sx={{
                alignItems: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 1.5,
                borderStyle: "dashed",
                display: "flex",
                justifyContent: "center",
                minHeight: 128,
                px: 2,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary" variant="body2">
                No tasks
              </Typography>
            </Box>
          )))}

      {isFetchingMore && (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: 48,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Loading more
          </Typography>
        </Box>
      )}
    </Box>
  );
}
