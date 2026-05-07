import { create } from "zustand";

import type { ModalState } from "@/stores/types/modalStore.types";

export const useModalStore = create<ModalState>((set) => ({
  isTaskModalOpen: false,
  isColumnModalOpen: false,

  editingTaskId: null,
  editingColumnId: null,

  openTaskModal: (taskId) => {
    set({
      isTaskModalOpen: true,
      editingTaskId: taskId ?? null,
    });
  },
  closeTaskModal: () => {
    set({
      isTaskModalOpen: false,
      editingTaskId: null,
    });
  },
  openColumnModal: (columnId) => {
    set({
      isColumnModalOpen: true,
      editingColumnId: columnId ?? null,
    });
  },
  closeColumnModal: () => {
    set({
      isColumnModalOpen: false,
      editingColumnId: null,
    });
  },
}));
