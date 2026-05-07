import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";

export type ButtonProps = MuiButtonProps;

export function Button({
  variant = "contained",
  disableElevation = true,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      disableElevation={disableElevation}
      {...props}
    />
  );
}
