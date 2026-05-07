import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useSortable } from "@dnd-kit/react/sortable";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  getTaskDndId,
  isTaskDndData,
  TASK_DND_TYPE,
  type TaskDndData,
} from "@/components/dnd/boardDnd";

import { AvatarGroup, PriorityChip } from "@/components/molecules";
import type { Assignee } from "@/types/assignees";
import type { Task } from "@/types/tasks";

export interface TaskCardProps {
  assignees: Assignee[];
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  sortable: {
    index: number;
    nextOrder?: Task["order"];
    previousOrder?: Task["order"];
  };
  sx?: SxProps<Theme>;
  task: Task;
}

export function TaskCard({
  assignees,
  onDelete,
  onEdit,
  sortable,
  sx,
  task,
}: TaskCardProps) {
  const taskAssignees = assignees.filter((assignee) =>
    task.assigneeIds.includes(assignee.id),
  );
  const hasActions = Boolean(onEdit || onDelete);

  const taskDndData: TaskDndData = {
    columnId: task.columnId,
    kind: "task",
    nextOrder: sortable.nextOrder,
    previousOrder: sortable.previousOrder,
    task,
  };

  const {
    isDragging,
    isDropTarget,
    ref: sortableRef,
  } = useSortable<TaskDndData>({
    accept: (source) =>
      isTaskDndData(source.data) && source.data.columnId === task.columnId,
    data: taskDndData,
    group: task.columnId,
    id: getTaskDndId(task.id),
    index: sortable.index,
    type: TASK_DND_TYPE,
  });

  return (
    <Paper
      component="article"
      elevation={0}
      ref={sortableRef}
      sx={[
        {
          bgcolor: "background.paper",
          border: 1,
          borderColor: "#d7e1e7",
          borderRadius: 1.5,
          boxShadow: "0 2px 5px rgba(38, 58, 77, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          minHeight: 166,
          p: 3,
          position: "relative",
          transition: "border-color 160ms ease, box-shadow 160ms ease",
          width: "100%",
          opacity: isDragging ? 0.45 : 1,
          outline: isDropTarget ? "2px solid #8bc2c6" : "none",
          outlineOffset: 2,
          "&:focus-within, &:hover": {
            borderColor: "#b8cad5",
            boxShadow: "0 4px 12px rgba(38, 58, 77, 0.12)",
          },
          "&:focus-within .TaskCard-actions, &:hover .TaskCard-actions": {
            opacity: 1,
            pointerEvents: "auto",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      variant="outlined"
    >
      <Box
        sx={{
          minHeight: 0,
        }}
      >
        <Typography
          component="h3"
          sx={{
            color: "text.primary",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1.35,
            overflowWrap: "anywhere",
            pr: hasActions ? 5 : 0,
          }}
        >
          {task.title}
        </Typography>

        {hasActions && (
          <Box
            className="TaskCard-actions"
            sx={{
              display: "flex",
              gap: 0.25,
              opacity: 0,
              pointerEvents: "none",
              position: "absolute",
              right: 12,
              top: 12,
              transition: "opacity 160ms ease",
            }}
          >
            {onEdit && (
              <Tooltip title="Edit task">
                <IconButton
                  aria-label={`Edit ${task.title}`}
                  onClick={() => onEdit(task)}
                  size="small"
                  sx={{
                    bgcolor: "background.paper",
                    color: "#6f7b8a",
                    "&:hover": {
                      bgcolor: "#f3f7f9",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title="Delete task">
                <IconButton
                  aria-label={`Delete ${task.title}`}
                  color="error"
                  onClick={() => onDelete(task)}
                  size="small"
                  sx={{
                    bgcolor: "background.paper",
                    color: "#9aa1a8",
                    "&:hover": {
                      bgcolor: "#f3f7f9",
                      color: "error.main",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          color: "#52647a",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.5,
          overflowWrap: "anywhere",
        }}
        variant="body2"
      >
        {task.description}
      </Typography>

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          mt: "auto",
        }}
      >
        <PriorityChip priority={task.priority} />
        <AvatarGroup assignees={taskAssignees} />
      </Box>
    </Paper>
  );
}
