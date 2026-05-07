import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type ColorPickerProps = Omit<
  TextFieldProps,
  "maxRows" | "minRows" | "multiline" | "rows" | "select" | "slotProps" | "type"
>;

export function ColorPicker({
  label,
  size = "small",
  variant = "outlined",
  ...props
}: ColorPickerProps) {
  return (
    <TextField
      {...props}
      label={label}
      size={size}
      slotProps={{
        htmlInput: {
          "aria-label": label ? undefined : "Color",
        },
        inputLabel: {
          shrink: true,
        },
      }}
      fullWidth
      sx={{
        "& input": {
          height: 42,
          p: 0.75,
        },
      }}
      type="color"
      variant={variant}
    />
  );
}
