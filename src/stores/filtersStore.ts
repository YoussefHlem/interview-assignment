import { create } from "zustand";

import type {
  DefaultFilters,
  FiltersState,
} from "@/stores/types/filterStore.types";

const defaultFilters: DefaultFilters = {
  searchQuery: "",
  selectedPriorities: [],
  selectedAssignees: [],
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaultFilters,
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
  },
  setSelectedPriorities: (selectedPriorities) => {
    set({ selectedPriorities: [...selectedPriorities] });
  },
  setSelectedAssignees: (selectedAssignees) => {
    set({ selectedAssignees: [...selectedAssignees] });
  },
  resetFilters: () => {
    set({
      searchQuery: defaultFilters.searchQuery,
      selectedPriorities: [...defaultFilters.selectedPriorities],
      selectedAssignees: [...defaultFilters.selectedAssignees],
    });
  },
}));
