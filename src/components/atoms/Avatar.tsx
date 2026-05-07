import type { ReactNode } from "react";

import MuiAvatar, {
  type AvatarProps as MuiAvatarProps,
} from "@mui/material/Avatar";

export interface AvatarProps extends Omit<MuiAvatarProps, "children"> {
  children?: ReactNode;
  name?: string;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function Avatar({ children, name, sx, ...props }: AvatarProps) {
  return (
    <MuiAvatar
      alt={props.alt ?? name}
      sx={{
        height: 28,
        width: 28,
        fontSize: 12,
        fontWeight: 700,
        ...sx,
      }}
      {...props}
    >
      {children ?? (name ? getInitials(name) : undefined)}
    </MuiAvatar>
  );
}
