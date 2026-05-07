import { useMemo, useState, type MouseEvent } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Avatar, Button } from "@/components/atoms";
import type { Assignee } from "@/types/assignees";

export interface AssigneeDropdownProps {
  assignees: Assignee[];
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  onChange: (selectedAssigneeIds: Assignee["id"][]) => void;
  selectedAssigneeIds: Assignee["id"][];
}

export function AssigneeDropdown({
  assignees,
  disabled = false,
  label = "Assignee",
  loading = false,
  onChange,
  selectedAssigneeIds,
}: AssigneeDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const selectedAssignees = useMemo(
    () =>
      assignees.filter((assignee) =>
        selectedAssigneeIds.includes(assignee.id),
      ),
    [assignees, selectedAssigneeIds],
  );

  const buttonLabel =
    selectedAssignees.length === 0
      ? label
      : selectedAssignees.length === 1
        ? selectedAssignees[0].name
        : `${selectedAssignees.length} assignees`;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleAssignee = (assigneeId: Assignee["id"]) => {
    const nextAssigneeIds = selectedAssigneeIds.includes(assigneeId)
      ? selectedAssigneeIds.filter(
          (selectedAssigneeId) => selectedAssigneeId !== assigneeId,
        )
      : [...selectedAssigneeIds, assigneeId];

    onChange(nextAssigneeIds);
  };

  return (
    <>
      <Button
        aria-controls={open ? "assignee-filter-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="menu"
        color="inherit"
        disabled={disabled}
        endIcon={<KeyboardArrowDownIcon fontSize="small" />}
        onClick={handleOpen}
        sx={{
          backgroundColor: "background.paper",
          borderColor: "divider",
          borderRadius: 1.5,
          color: "text.primary",
          height: 40,
          justifyContent: "space-between",
          minWidth: 180,
          px: 1.5,
          textTransform: "none",
        }}
        type="button"
        variant="outlined"
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          {selectedAssignees.length > 0 ? (
            <Stack direction="row" sx={{ "& .MuiAvatar-root": { ml: -0.5 } }}>
              {selectedAssignees.slice(0, 3).map((assignee) => (
                <Avatar
                  key={assignee.id}
                  name={assignee.name}
                  src={assignee.avatarUrl}
                  sx={{
                    bgcolor: assignee.color,
                    border: 1,
                    borderColor: "background.paper",
                    height: 24,
                    width: 24,
                  }}
                />
              ))}
            </Stack>
          ) : null}
          <Typography component="span" noWrap variant="body2">
            {loading ? "Loading" : buttonLabel}
          </Typography>
        </Stack>
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="assignee-filter-menu"
        onClose={handleClose}
        open={open}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1.5,
              minWidth: 240,
              mt: 1,
            },
          },
        }}
      >
        {assignees.length === 0 ? (
          <MenuItem disabled>
            <Typography color="text.secondary" variant="body2">
              {loading ? "Loading assignees" : "No assignees"}
            </Typography>
          </MenuItem>
        ) : (
          assignees.map((assignee) => {
            const selected = selectedAssigneeIds.includes(assignee.id);

            return (
              <MenuItem
                key={assignee.id}
                onClick={() => toggleAssignee(assignee.id)}
                selected={selected}
              >
                <Checkbox checked={selected} disableRipple size="small" />
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar
                    name={assignee.name}
                    src={assignee.avatarUrl}
                    sx={{ bgcolor: assignee.color }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={assignee.name}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      variant: "body2",
                    },
                  }}
                />
              </MenuItem>
            );
          })
        )}
        {selectedAssigneeIds.length > 0 ? (
          <Box sx={{ borderTop: 1, borderColor: "divider", mt: 0.5, pt: 0.5 }}>
            <MenuItem onClick={() => onChange([])}>
              <Typography color="text.secondary" variant="body2">
                Clear assignees
              </Typography>
            </MenuItem>
          </Box>
        ) : null}
      </Menu>
    </>
  );
}
