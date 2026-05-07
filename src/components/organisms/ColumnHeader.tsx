import type { HTMLAttributes } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import type { SxProps, Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Chip } from "@/components/atoms";
import type { BoardColumn } from "@/types/columns";

export interface ColumnHeaderProps {
  column: BoardColumn;
  dragHandleRef?: (element: Element | null) => void;
  dragHandleProps?: HTMLAttributes<HTMLDivElement>;
  onDelete?: (column: BoardColumn) => void;
  onEdit?: (column: BoardColumn) => void;
  sx?: SxProps<Theme>;
  taskCount: number;
}

export function ColumnHeader({
  column,
  dragHandleRef,
  dragHandleProps,
  onDelete,
  onEdit,
  sx,
  taskCount,
}: ColumnHeaderProps) {
  const hasTasks = taskCount > 0;

  return (
    <Box
      component="header"
      sx={[
        {
          alignItems: "center",
          display: "flex",
          gap: 1.25,
          minHeight: 64,
          px: 2.5,
          py: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        {...dragHandleProps}
        aria-label={dragHandleProps?.["aria-label"] ?? `Drag ${column.title}`}
        ref={dragHandleRef}
        sx={{
          alignItems: "center",
          color: "#6d7a8b",
          cursor: dragHandleProps ? "grab" : "default",
          display: "flex",
          flexShrink: 0,
          touchAction: "none",
          "& svg": {
            fontSize: 18,
          },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>

      <Box
        sx={{
          bgcolor: column.color,
          borderRadius: 999,
          flexShrink: 0,
          height: 10,
          width: 10,
        }}
      />

      <Typography
        component="h2"
        noWrap
        sx={{
          color: "text.primary",
          flex: 1,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0,
          minWidth: 0,
          textTransform: "uppercase",
        }}
      >
        {column.title}
      </Typography>

      <Chip
        aria-label={`${taskCount} tasks`}
        label={taskCount}
        sx={{
          bgcolor: "#edf2f7",
          borderRadius: 999,
          color: "#6a7484",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          fontWeight: 700,
          height: 32,
          minWidth: 54,
          "& .MuiChip-label": {
            px: 1.25,
          },
        }}
      />

      {onEdit && (
        <Tooltip title="Edit column">
          <IconButton
            aria-label={`Edit ${column.title}`}
            onClick={() => onEdit(column)}
            size="small"
            sx={{
              color: "#6f7b8a",
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip
          title={hasTasks ? "Move or delete tasks first" : "Delete column"}
        >
          <Box component="span" sx={{ display: "inline-flex" }}>
            <IconButton
              aria-label={`Delete ${column.title}`}
              color="error"
              disabled={hasTasks}
              onClick={() => {
                onDelete(column);
              }}
              size="small"
              sx={{
                color: "#9aa1a8",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
