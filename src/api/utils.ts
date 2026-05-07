import type { Priority, TaskQueryParams } from "@/types/tasks";

type TaskWhereParams = {
  columnId?: {
    eq: string;
  };
  priority?: {
    in: Priority[];
  };
  or?: (
    | {
        title: {
          contains: string;
        };
      }
    | {
        description: {
          contains: string;
        };
      }
  )[];
};

export function buildTaskQueryParams(params: TaskQueryParams = {}) {
  const where: TaskWhereParams = {};
  const search = params.search?.trim();

  if (params.columnId) {
    where.columnId = {
      eq: params.columnId,
    };
  }

  if (params.priorities?.length) {
    where.priority = {
      in: params.priorities,
    };
  }

  if (search) {
    where.or = [
      {
        title: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  const queryParams = new URLSearchParams({
    _page: String(params.page ?? 1),
    _per_page: String(params.perPage ?? 20),
    _sort: "order",
  });

  if (Object.keys(where).length > 0) {
    queryParams.set("_where", JSON.stringify(where));
  }

  return queryParams;
}
