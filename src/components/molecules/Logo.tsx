import ViewKanbanIcon from "@mui/icons-material/ViewKanban";

import { Button, type ButtonProps } from "@/components/atoms";

export interface LogoProps
  extends Omit<ButtonProps, "children" | "startIcon" | "variant"> {
  label?: string;
}

export function Logo({ label = "Logo", sx, type = "button", ...props }: LogoProps) {
  return (
    <Button
      {...props}
      color="inherit"
      startIcon={<ViewKanbanIcon fontSize="small" />}
      sx={[
        {
          backgroundColor: "background.paper",
          borderColor: "divider",
          borderRadius: 1.5,
          color: "text.primary",
          fontWeight: 700,
          height: 40,
          minWidth: 148,
          px: 2,
          textTransform: "none",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      type={type}
      variant="outlined"
    >
      {label}
    </Button>
  );
}
