import type { ReactNode } from "react";

import Alert, { type AlertColor, type AlertProps } from "@mui/material/Alert";

import Snackbar, { type SnackbarProps } from "@mui/material/Snackbar";

export interface ToastProps extends Omit<
  SnackbarProps,
  "children" | "message"
> {
  alertProps?: Omit<AlertProps, "children" | "severity">;
  message: ReactNode;
  severity?: AlertColor;
}

export function Toast({
  alertProps,
  anchorOrigin = { horizontal: "center", vertical: "bottom" },
  autoHideDuration = 4000,
  message,
  severity = "info",
  ...props
}: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      {...props}
    >
      <Alert severity={severity} variant="filled" {...alertProps}>
        {message}
      </Alert>
    </Snackbar>
  );
}
