import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type InputProps = Omit<
  TextFieldProps,
  "maxRows" | "minRows" | "multiline" | "rows"
>;

export function Input({
  fullWidth = true,
  size = "small",
  variant = "outlined",
  ...props
}: InputProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      {...props}
    />
  );
}
