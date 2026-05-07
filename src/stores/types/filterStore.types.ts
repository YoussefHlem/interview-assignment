import type { Assignee } from "@/types/assignees";
import type { Priority } from "@/types/tasks";

export type FiltersState = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;

  selectedPriorities: Priority[];
  setSelectedPriorities: (selectedPriorities: Priority[]) => void;

  selectedAssignees: Assignee["id"][];
  setSelectedAssignees: (selectedAssignees: Assignee["id"][]) => void;

  resetFilters: () => void;
};

export type DefaultFilters = Pick<
  FiltersState,
  "searchQuery" | "selectedPriorities" | "selectedAssignees"
>;
