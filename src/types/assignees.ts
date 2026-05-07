export type Assignee = {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
};

export type CreateAssigneePayload = Omit<Assignee, "id">;

export type UpdateAssigneePayload = Partial<CreateAssigneePayload>;
