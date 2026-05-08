export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
  assigneeIds: string[];
  order: number;
};

export type TasksResponse = {
  data: Task[];
  items: number;
};

export type CreateTaskPayload = Omit<Task, "id">;

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export type TaskQueryParams = {
  page?: number;
  perPage?: number;
  columnId?: string;
  priorities?: Priority[];
  assigneeIds?: string[];
  search?: string;
};
