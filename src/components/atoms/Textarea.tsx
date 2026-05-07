import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type TextareaProps = Omit<TextFieldProps, "multiline" | "type">;

export function Textarea({
  fullWidth = true,
  minRows = 3,
  size = "small",
  variant = "outlined",
  ...props
}: TextareaProps) {
  return (
    <TextField
      fullWidth={fullWidth}
      minRows={minRows}
      multiline
      size={size}
      variant={variant}
      {...props}
    />
  );
}
