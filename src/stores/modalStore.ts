import { create } from "zustand";

import type { ModalState } from "@/stores/types/modalStore.types";

// Resitting the Ids in Eventloop using setTimeOut solving an issue of resetting the data upon closeing modal before its get closed.
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
      isTaskModalOpen: false,
    });

    setTimeout(() => {
      set({
        creatingTaskColumnId: null,
        editingTaskId: null,
      });
    }, 0);
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
    });

    setTimeout(() => {
      set({
        editingColumnId: null,
      });
    }, 0);
  },
}));
