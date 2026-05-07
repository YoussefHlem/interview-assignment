import Stack from "@mui/material/Stack";

import { Button, type ButtonProps } from "@/components/atoms";
import type { Priority } from "@/types/tasks";

type PriorityOption = {
  color: ButtonProps["color"];
  label: string;
  value: Priority;
};

const priorityOptions: PriorityOption[] = [
  { color: "error", label: "High", value: "high" },
  { color: "warning", label: "Medium", value: "medium" },
  { color: "success", label: "Low", value: "low" },
];

export interface PrioritySwitcherProps {
  disabled?: boolean;
  onChange: (selectedPriorities: Priority[]) => void;
  selectedPriorities: Priority[];
}

export function PrioritySwitcher({
  disabled = false,
  onChange,
  selectedPriorities,
}: PrioritySwitcherProps) {
  const togglePriority = (priority: Priority) => {
    const nextPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(
          (selectedPriority) => selectedPriority !== priority,
        )
      : [...selectedPriorities, priority];

    onChange(nextPriorities);
  };
  return (
    <Stack
      aria-label="Priority filters"
      direction="row"
      role="group"
      spacing={0.75}
    >
      {priorityOptions.map((option) => {
        const selected = selectedPriorities.includes(option.value);

        return (
          <Button
            aria-label={`${option.value} priority`}
            aria-pressed={selected}
            color={selected ? option.color : "inherit"}
            disabled={disabled}
            key={option.value}
            onClick={() => togglePriority(option.value)}
            sx={{
              borderColor: selected ? undefined : "divider",
              borderRadius: 1.5,
              color: selected ? undefined : "text.primary",
              fontWeight: 700,
              height: 40,
              minWidth: 40,
              px: 1,
            }}
            type="button"
            variant={selected ? "contained" : "outlined"}
          >
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
}
