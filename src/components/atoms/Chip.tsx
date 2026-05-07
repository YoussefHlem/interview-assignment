import MuiChip, { type ChipProps as MuiChipProps } from "@mui/material/Chip";

export type ChipProps = MuiChipProps;

export function Chip({
  size = "small",
  variant = "filled",
  ...props
}: ChipProps) {
  return (
    <MuiChip
      size={size}
      variant={variant}
      {...props}
    />
  );
}
