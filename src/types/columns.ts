export type BoardColumn = {
  id: string;
  title: string;
  color: string;
  order: number;
};

export type CreateColumnPayload = Omit<BoardColumn, "id">;

export type UpdateColumnPayload = Partial<CreateColumnPayload>;
