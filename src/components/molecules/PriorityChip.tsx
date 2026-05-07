import { Chip, type ChipProps } from "@/components/atoms";
import type { Priority } from "@/types/tasks";

type PriorityChipMeta = {
  backgroundColor: string;
  color: string;
  label: string;
};

const priorityChipMeta = {
  high: {
    backgroundColor: "#fde2e2",
    color: "#e05252",
    label: "HIGH",
  },
  low: {
    backgroundColor: "#eceff3",
    color: "#617185",
    label: "LOW",
  },
  medium: {
    backgroundColor: "#fff0d8",
    color: "#e19320",
    label: "MEDIUM",
  },
} satisfies Record<Priority, PriorityChipMeta>;

export interface PriorityChipProps extends Omit<ChipProps, "color" | "label"> {
  priority: Priority;
}

export function PriorityChip({ priority, sx, ...props }: PriorityChipProps) {
  const meta = priorityChipMeta[priority];

  return (
    <Chip
      {...props}
      aria-label={`${meta.label} priority`}
      label={meta.label}
      sx={[
        {
          bgcolor: meta.backgroundColor,
          borderRadius: 1,
          color: meta.color,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          fontWeight: 700,
          height: 24,
          minWidth: 32,
          px: 0.25,
          textTransform: "uppercase",
          "& .MuiChip-label": {
            px: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
