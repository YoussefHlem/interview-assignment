import { create } from "zustand";

import type { ModalState } from "@/stores/types/modalStore.types";

export const useModalStore = create<ModalState>((set) => ({
  isTaskModalOpen: false,
  isColumnModalOpen: false,

  editingTaskId: null,
  creatingTaskColumnId: null,
  editingColumnId: null,

  openTaskModal: (taskId, columnId) => {
    set({
      creatingTaskColumnId: taskId ? null : (columnId ?? null),
      isTaskModalOpen: true,
      editingTaskId: taskId ?? null,
    });
  },
  closeTaskModal: () => {
    set({
      creatingTaskColumnId: null,
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
