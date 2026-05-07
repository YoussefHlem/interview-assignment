import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useShallow } from "zustand/react/shallow";

import {
  AssigneeDropdown,
  Logo,
  PrioritySwitcher,
  SearchInput,
} from "@/components/molecules";
import { useAssignees } from "@/hooks/assignees/useAssignees";
import { useFiltersStore } from "@/stores/filtersStore";

export interface HeaderProps {
  logoLabel?: string;
  sx?: SxProps<Theme>;
}

export function Header({ logoLabel = "Logo", sx }: HeaderProps) {
  const { searchQuery, selectedPriorities, selectedAssignees } =
    useFiltersStore(
      useShallow((state) => ({
        searchQuery: state.searchQuery,
        selectedAssignees: state.selectedAssignees,
        selectedPriorities: state.selectedPriorities,
      })),
    );

  const { setSearchQuery, setSelectedPriorities, setSelectedAssignees } =
    useFiltersStore(
      useShallow((state) => ({
        setSearchQuery: state.setSearchQuery,
        setSelectedAssignees: state.setSelectedAssignees,
        setSelectedPriorities: state.setSelectedPriorities,
      })),
    );

  const { data: assignees = [], isFetching } = useAssignees();

  return (
    <Box
      component="header"
      sx={[
        {
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, md: 3 },
          py: 1.5,
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          alignItems: { xs: "stretch", md: "center" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1.5,
          justifyContent: "space-between",
          mx: "auto",
          width: "100%",
        }}
      >
        <Logo
          label={logoLabel}
          sx={{ alignSelf: { xs: "flex-start", md: "auto" } }}
        />

        <Box
          aria-label="Board filters"
          component="nav"
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            gap: 1,
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <SearchInput
            onChange={setSearchQuery}
            placeholder="Search"
            sx={{ width: { xs: "100%", sm: 240 } }}
            value={searchQuery}
          />
          <PrioritySwitcher
            onChange={setSelectedPriorities}
            selectedPriorities={selectedPriorities}
          />
          <AssigneeDropdown
            assignees={assignees}
            loading={isFetching}
            onChange={setSelectedAssignees}
            selectedAssigneeIds={selectedAssignees}
          />
        </Box>
      </Box>
    </Box>
  );
}
