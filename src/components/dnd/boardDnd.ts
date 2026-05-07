import type { Assignee } from "@/types/assignees";
import type { BoardColumn } from "@/types/columns";
import type { Task } from "@/types/tasks";

export const COLUMN_DND_GROUP = "board-columns";
export const COLUMN_DND_TYPE = "board-column";
export const TASK_DND_TYPE = "board-task";
export const TASK_DROP_DND_TYPE = "board-task-drop";

export type ColumnDndData = {
  column: BoardColumn;
  index: number;
  kind: "column";
};

export type TaskDndData = {
  columnId: BoardColumn["id"];
  kind: "task";
  nextOrder?: Task["order"];
  previousOrder?: Task["order"];
  task: Task;
};

export type TaskDropDndData = {
  columnId: BoardColumn["id"];
  kind: "task-drop";
  nextOrder?: Task["order"];
  previousOrder?: Task["order"];
};

export type BoardDndData = ColumnDndData | TaskDndData | TaskDropDndData;

export function isTaskDndData(data: unknown): data is TaskDndData {
  if (!data || typeof data !== "object" || !("kind" in data)) {
    return false;
  }

  return data.kind === "task";
}

export function getColumnDndId(columnId: BoardColumn["id"]) {
  return `column:${columnId}`;
}

export function getTaskDndId(taskId: Task["id"]) {
  return `task:${taskId}`;
}

export function getTaskDropDndId(columnId: BoardColumn["id"]) {
  return `task-drop:${columnId}`;
}

export function getTaskOrderBetween(
  previousOrder?: Task["order"],
  nextOrder?: Task["order"],
) {
  if (previousOrder === undefined && nextOrder === undefined) {
    return 0;
  }

  if (previousOrder === undefined) {
    return nextOrder! - 1;
  }

  if (nextOrder === undefined) {
    return previousOrder + 1;
  }

  return (previousOrder + nextOrder) / 2;
}

export function getColumnOrderBetween(
  previousOrder?: BoardColumn["order"],
  nextOrder?: BoardColumn["order"],
) {
  if (previousOrder === undefined && nextOrder === undefined) {
    return 0;
  }

  if (previousOrder === undefined) {
    return nextOrder! - 1;
  }

  if (nextOrder === undefined) {
    return previousOrder + 1;
  }

  return (previousOrder + nextOrder) / 2;
}

export function hasSelectedAssignee(
  task: Task,
  selectedAssigneeIds: Assignee["id"][],
) {
  return (
    selectedAssigneeIds.length === 0 ||
    task.assigneeIds.some((assigneeId) =>
      selectedAssigneeIds.includes(assigneeId),
    )
  );
}
