import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { Button, ColorPicker, Input } from "@/components/atoms";
import { useColumns } from "@/hooks/columns/useColumns";
import { useCreateColumn } from "@/hooks/columns/useCreateColumn";
import { useUpdateColumn } from "@/hooks/columns/useUpdateColumn";
import { useModalStore } from "@/stores/modalStore";
import type { BoardColumn } from "@/types/columns";

type ColumnFormState = {
  color: string;
  title: string;
};

type ColumnModalFormProps = {
  columns: BoardColumn[];
  editingColumn?: BoardColumn;
  editingColumnId: BoardColumn["id"] | null;
  onClose: () => void;
};

const DEFAULT_COLUMN_FORM: ColumnFormState = {
  color: "#1976d2",
  title: "",
};

const EMPTY_COLUMNS: BoardColumn[] = [];

function getInitialColumnForm(editingColumn?: BoardColumn): ColumnFormState {
  if (editingColumn) {
    return {
      color: editingColumn.color,
      title: editingColumn.title,
    };
  }

  return DEFAULT_COLUMN_FORM;
}

function getNextColumnOrder(columns: BoardColumn[]) {
  if (columns.length === 0) {
    return 0;
  }

  return Math.max(...columns.map((column) => column.order)) + 1;
}

function ColumnModalForm({
  columns,
  editingColumn,
  editingColumnId,
  onClose,
}: ColumnModalFormProps) {
  const [form, setForm] = useState<ColumnFormState>(() =>
    getInitialColumnForm(editingColumn),
  );
  const createColumnMutation = useCreateColumn();
  const updateColumnMutation = useUpdateColumn();

  const isEditing = Boolean(editingColumnId);
  const isSaving =
    createColumnMutation.isPending || updateColumnMutation.isPending;
  const canSave = form.title.trim().length > 0 && !isSaving;
  const mutationError =
    createColumnMutation.error ?? updateColumnMutation.error;

  const handleTextChange =
    (field: keyof ColumnFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
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

    try {
      if (editingColumnId) {
        await updateColumnMutation.mutateAsync({
          columnId: editingColumnId,
          payload: {
            color: form.color,
            title: form.title.trim(),
          },
        });
      } else {
        await createColumnMutation.mutateAsync({
          color: form.color,
          order: getNextColumnOrder(columns),
          title: form.title.trim(),
        });
      }

      onClose();
    } catch {
      // Mutation hooks handle cache rollback; keep the dialog open for retry.
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>{isEditing ? "Edit Column" : "New Column"}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: "10px !important",
        }}
      >
        {mutationError && (
          <Alert severity="error">Could not save the column.</Alert>
        )}

        <Input
          autoFocus
          disabled={isSaving}
          label="Title"
          onChange={handleTextChange("title")}
          required
          value={form.title}
        />
        <ColorPicker
          disabled={isSaving}
          label="Color"
          onChange={handleTextChange("color")}
          value={form.color}
        />
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

export function ColumnModal() {
  const isColumnModalOpen = useModalStore((state) => state.isColumnModalOpen);
  const editingColumnId = useModalStore((state) => state.editingColumnId);
  const closeColumnModal = useModalStore((state) => state.closeColumnModal);

  const columnsQuery = useColumns();
  const columns = columnsQuery.data ?? EMPTY_COLUMNS;
  const editingColumn = useMemo(
    () => columns.find((column) => column.id === editingColumnId),
    [columns, editingColumnId],
  );
  const isEditing = Boolean(editingColumnId);
  const isLoadingColumn = isEditing && columnsQuery.isLoading && !editingColumn;
  const cannotFindColumn =
    isEditing && !columnsQuery.isLoading && !editingColumn;

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={closeColumnModal}
      open={isColumnModalOpen}
    >
      {isLoadingColumn && (
        <>
          <DialogTitle>Edit Column</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Loading column
            </Typography>
          </DialogContent>
        </>
      )}

      {cannotFindColumn && (
        <>
          <DialogTitle>Edit Column</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Alert severity="error">Column could not be found.</Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeColumnModal} type="button">
              Close
            </Button>
          </DialogActions>
        </>
      )}

      {!isLoadingColumn && !cannotFindColumn && (
        <ColumnModalForm
          columns={columns}
          editingColumn={editingColumn}
          editingColumnId={editingColumnId}
          key={editingColumn?.id ?? "new-column"}
          onClose={closeColumnModal}
        />
      )}
    </Dialog>
  );
}
