import type { BoardColumn } from "@/types/columns";
import type { Task } from "@/types/tasks";

export type ModalState = {
  isTaskModalOpen: boolean;
  isColumnModalOpen: boolean;

  editingTaskId: Task["id"] | null;
  editingColumnId: BoardColumn["id"] | null;

  openTaskModal: (taskId?: Task["id"]) => void;
  closeTaskModal: () => void;
  openColumnModal: (columnId?: BoardColumn["id"]) => void;
  closeColumnModal: () => void;
};
