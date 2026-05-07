import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { useQueryClient } from "@tanstack/react-query";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Avatar, Button, Input, Textarea } from "@/components/atoms";
import { useAssignees } from "@/hooks/assignees/useAssignees";
import { useColumns } from "@/hooks/columns/useColumns";
import { useCreateTask } from "@/hooks/tasks/useCreateTask";
import { findCachedTask, useTask, useTasks } from "@/hooks/tasks/useTasks";
import { useUpdateTask } from "@/hooks/tasks/useUpdateTask";
import { useModalStore } from "@/stores/modalStore";

import type { Assignee } from "@/types/assignees";
import type { BoardColumn } from "@/types/columns";
import type { Task, Priority } from "@/types/tasks";

type TaskFormState = {
  assigneeIds: string[];
  columnId: string;
  description: string;
  priority: Priority;
  title: string;
};

type TaskModalFormProps = {
  assignees: Assignee[];
  columns: BoardColumn[];
  creatingTaskColumnId: BoardColumn["id"] | null;
  editingTask?: Task;
  editingTaskId: Task["id"] | null;
  onClose: () => void;
  tasks: Task[];
};

const DEFAULT_TASK_FORM: TaskFormState = {
  assigneeIds: [],
  columnId: "",
  description: "",
  priority: "medium",
  title: "",
};

const priorityOptions: Array<{ label: string; value: Priority }> = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const EMPTY_ASSIGNEES: Assignee[] = [];
const EMPTY_COLUMNS: BoardColumn[] = [];

function getInitialTaskForm(
  columns: BoardColumn[],
  creatingTaskColumnId?: BoardColumn["id"] | null,
  editingTask?: Task,
): TaskFormState {
  if (editingTask) {
    return {
      assigneeIds: [...editingTask.assigneeIds],
      columnId: editingTask.columnId,
      description: editingTask.description,
      priority: editingTask.priority,
      title: editingTask.title,
    };
  }

  return {
    ...DEFAULT_TASK_FORM,
    columnId: creatingTaskColumnId ?? columns[0]?.id ?? "",
  };
}

function getNextTaskOrder(
  tasks: Task[],
  columnId: string,
  excludeTaskId?: Task["id"],
) {
  const columnTasks = tasks.filter(
    (task) => task.columnId === columnId && task.id !== excludeTaskId,
  );

  if (columnTasks.length === 0) {
    return 0;
  }

  return Math.max(...columnTasks.map((task) => task.order)) + 1;
}

function TaskModalForm({
  assignees,
  columns,
  creatingTaskColumnId,
  editingTask,
  editingTaskId,
  onClose,
  tasks,
}: TaskModalFormProps) {
  const [form, setForm] = useState<TaskFormState>(() =>
    getInitialTaskForm(columns, creatingTaskColumnId, editingTask),
  );

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const selectedAssignees = assignees.filter((assignee) =>
    form.assigneeIds.includes(assignee.id),
  );
  const selectedAssigneeNames = selectedAssignees
    .map((assignee) => assignee.name)
    .join(", ");

  const isEditing = Boolean(editingTaskId);
  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending;
  const canSave = form.title.trim().length > 0 && form.columnId && !isSaving;
  const mutationError = createTaskMutation.error ?? updateTaskMutation.error;

  const handleTextChange =
    (field: "description" | "title") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleColumnChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      columnId: event.target.value,
    }));
  };

  const handlePriorityChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      priority: event.target.value as Priority,
    }));
  };

  const handleAssigneesChange = (event: SelectChangeEvent<string[]>) => {
    const nextAssigneeIds = event.target.value;

    setForm((currentForm) => ({
      ...currentForm,
      assigneeIds:
        typeof nextAssigneeIds === "string"
          ? nextAssigneeIds.split(",")
          : nextAssigneeIds,
    }));
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    const nextOrder =
      editingTask && editingTask.columnId === form.columnId
        ? editingTask.order
        : getNextTaskOrder(tasks, form.columnId, editingTask?.id);

    const payload = {
      assigneeIds: form.assigneeIds,
      columnId: form.columnId,
      description: form.description.trim(),
      order: nextOrder,
      priority: form.priority,
      title: form.title.trim(),
    };

    try {
      if (editingTaskId) {
        await updateTaskMutation.mutateAsync({
          payload,
          taskId: editingTaskId,
        });
      } else {
        await createTaskMutation.mutateAsync(payload);
      }

      onClose();
    } catch {
      // Mutation hooks handle cache rollback; keep the dialog open for retry.
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>{isEditing ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 1,
        }}
      >
        {mutationError && (
          <Alert severity="error">Could not save the task.</Alert>
        )}

        <Input
          autoFocus
          disabled={isSaving}
          label="Title"
          onChange={handleTextChange("title")}
          required
          value={form.title}
        />

        <Textarea
          disabled={isSaving}
          label="Description"
          minRows={4}
          onChange={handleTextChange("description")}
          value={form.description}
        />

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          }}
        >
          <Input
            disabled={isSaving || columns.length === 0}
            label="Column"
            onChange={handleColumnChange}
            required
            select
            value={form.columnId}
          >
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.title}
              </MenuItem>
            ))}
          </Input>

          <Input
            disabled={isSaving}
            label="Priority"
            onChange={handlePriorityChange}
            select
            value={form.priority}
          >
            {priorityOptions.map((priority) => (
              <MenuItem key={priority.value} value={priority.value}>
                {priority.label}
              </MenuItem>
            ))}
          </Input>
        </Box>

        <FormControl disabled={isSaving} fullWidth size="small">
          <InputLabel id="task-assignees-label">Assignees</InputLabel>
          <Select
            input={<OutlinedInput label="Assignees" />}
            labelId="task-assignees-label"
            multiple
            onChange={handleAssigneesChange}
            renderValue={() => (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", minWidth: 0 }}
              >
                {selectedAssignees.length > 0 && (
                  <>
                    <Stack
                      direction="row"
                      sx={{
                        pl: 0.5,
                        "& .MuiAvatar-root": {
                          ml: -0.5,
                        },
                      }}
                    >
                      {selectedAssignees.slice(0, 3).map((assignee) => (
                        <Avatar
                          key={assignee.id}
                          name={assignee.name}
                          src={assignee.avatarUrl}
                          sx={{
                            bgcolor: assignee.color,
                            border: 1,
                            borderColor: "background.paper",
                            height: 24,
                            width: 24,
                          }}
                        />
                      ))}
                    </Stack>
                    <Typography component="span" noWrap variant="body2">
                      {selectedAssigneeNames}
                    </Typography>
                  </>
                )}

                {selectedAssignees.length === 0 && (
                  <Typography color="text.secondary" variant="body2">
                    Unassigned
                  </Typography>
                )}
              </Stack>
            )}
            value={form.assigneeIds}
          >
            {assignees.map((assignee) => (
              <MenuItem key={assignee.id} value={assignee.id}>
                <Checkbox
                  checked={form.assigneeIds.includes(assignee.id)}
                  size="small"
                />
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar
                    name={assignee.name}
                    src={assignee.avatarUrl}
                    sx={{
                      bgcolor: assignee.color,
                      height: 28,
                      width: 28,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText primary={assignee.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          color="inherit"
          disabled={isSaving}
          onClick={handleClose}
          type="button"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button disabled={!canSave} type="submit">
          {isSaving ? "Saving" : "Save"}
        </Button>
      </DialogActions>
    </Box>
  );
}

export function TaskModal() {
  const isTaskModalOpen = useModalStore((state) => state.isTaskModalOpen);
  const editingTaskId = useModalStore((state) => state.editingTaskId);
  const creatingTaskColumnId = useModalStore(
    (state) => state.creatingTaskColumnId,
  );
  const closeTaskModal = useModalStore((state) => state.closeTaskModal);

  const queryClient = useQueryClient();
  const assigneesQuery = useAssignees();
  const columnsQuery = useColumns();
  const tasksQuery = useTasks();
  const taskDetailQuery = useTask(editingTaskId);
  const assignees = assigneesQuery.data ?? EMPTY_ASSIGNEES;
  const columns = columnsQuery.data ?? EMPTY_COLUMNS;
  const tasks = useMemo(
    () => tasksQuery.data?.data ?? [],
    [tasksQuery.data?.data],
  );
  const cachedEditingTask = useMemo(() => {
    if (!editingTaskId) {
      return undefined;
    }

    return (
      tasks.find((task) => task.id === editingTaskId) ??
      findCachedTask(queryClient, editingTaskId)
    );
  }, [editingTaskId, queryClient, tasks]);
  const editingTask = cachedEditingTask ?? taskDetailQuery.data;
  const isEditing = Boolean(editingTaskId);
  const isLoadingTask =
    isEditing &&
    !editingTask &&
    (tasksQuery.isLoading || taskDetailQuery.isLoading);
  const cannotFindTask =
    isEditing &&
    !editingTask &&
    !tasksQuery.isLoading &&
    !taskDetailQuery.isLoading;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={closeTaskModal}
      open={isTaskModalOpen}
    >
      {isLoadingTask && (
        <>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Loading task
            </Typography>
          </DialogContent>
        </>
      )}

      {cannotFindTask && (
        <>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Alert severity="error">Task could not be found.</Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeTaskModal} type="button">
              Close
            </Button>
          </DialogActions>
        </>
      )}

      {!isLoadingTask && !cannotFindTask && (
        <TaskModalForm
          assignees={assignees}
          columns={columns}
          creatingTaskColumnId={creatingTaskColumnId}
          editingTask={editingTask}
          editingTaskId={editingTaskId}
          key={editingTask?.id ?? creatingTaskColumnId ?? "new-task"}
          onClose={closeTaskModal}
          tasks={tasks}
        />
      )}
    </Dialog>
  );
}
