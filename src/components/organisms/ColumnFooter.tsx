import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

import { Button } from "@/components/atoms";

export interface ColumnFooterProps {
  onAddTask?: () => void;
  sx?: SxProps<Theme>;
}

export function ColumnFooter({ onAddTask, sx }: ColumnFooterProps) {
  return (
    <Box
      component="footer"
      sx={[
        {
          p: 2,
          pt: 1.5,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Button
        color="inherit"
        fullWidth
        onClick={onAddTask}
        startIcon={<AddIcon fontSize="small" />}
        sx={{
          borderColor: "#cfe6e8",
          borderRadius: 1.5,
          borderStyle: "dashed",
          color: "#6c7d90",
          fontWeight: 700,
          height: 44,
          justifyContent: "center",
          textTransform: "none",
          "&:hover": {
            borderStyle: "dashed",
          },
        }}
        type="button"
        variant="outlined"
      >
        Add Task
      </Button>
    </Box>
  );
}
