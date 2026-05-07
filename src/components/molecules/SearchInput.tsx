import type { ChangeEvent } from "react";

import ClearIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { Input, type InputProps } from "@/components/atoms";

export interface SearchInputProps extends Omit<
  InputProps,
  "onChange" | "placeholder" | "slotProps" | "type" | "value"
> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchInput({
  onChange,
  onClear,
  placeholder = "Search",
  sx,
  value,
  ...props
}: SearchInputProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <Input
      {...props}
      slotProps={{
        htmlInput: {
          "aria-label": placeholder,
        },
        input: {
          endAdornment: Boolean(value) && (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                edge="end"
                onClick={handleClear}
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
      onChange={handleChange}
      placeholder={placeholder}
      sx={[
        {
          minWidth: { xs: 180, sm: 220 },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
            borderRadius: 1.5,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      type="text"
      value={value}
    />
  );
}
