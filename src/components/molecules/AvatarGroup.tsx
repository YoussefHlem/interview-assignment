import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

import { Avatar } from "@/components/atoms";
import type { Assignee } from "@/types/assignees";

export interface AvatarGroupProps {
  assignees: Assignee[];
  sx?: SxProps<Theme>;
}

export function AvatarGroup({ assignees, sx }: AvatarGroupProps) {
  if (assignees.length === 0) {
    return null;
  }

  const visibleAssignees = assignees.slice(0, 5);
  const overflowAssignees = assignees.slice(5);

  return (
    <Box
      aria-label={`${assignees.length} assigned ${
        assignees.length === 1 ? "person" : "people"
      }`}
      sx={[
        {
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          pl: visibleAssignees.length > 1 ? 0.75 : 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {visibleAssignees.map((assignee, index) => (
        <Tooltip key={assignee.id} title={assignee.name}>
          <Avatar
            name={assignee.name}
            src={assignee.avatarUrl}
            sx={{
              bgcolor: assignee.color,
              border: 1,
              borderColor: "background.paper",
              height: 28,
              ml: index === 0 ? 0 : -0.75,
              width: 28,
            }}
          />
        </Tooltip>
      ))}

      {overflowAssignees.length > 0 && (
        <Tooltip
          title={overflowAssignees.map((assignee) => assignee.name).join(", ")}
        >
          <Avatar
            sx={{
              bgcolor: "grey.600",
              border: 1,
              borderColor: "background.paper",
              fontSize: 11,
              height: 28,
              ml: -0.75,
              width: 28,
            }}
          >
            +{overflowAssignees.length}
          </Avatar>
        </Tooltip>
      )}
    </Box>
  );
}
