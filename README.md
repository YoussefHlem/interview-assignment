# Interview Assignment

A React + TypeScript Kanban board for managing tasks across columns. The app loads columns, tasks, and assignees from a REST API, supports board filtering, and persists create/update/delete/reorder actions back to the API.

## Features

- Create, edit, delete, and reorder board columns
- Create, edit, delete, reorder, and move tasks between columns
- Filter tasks by search text, priority, and assignee
- Infinite task loading per column
- Optimistic UI updates for task and column mutations
- Responsive board layout with Material UI components

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- dnd-kit

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

The app expects the API base URL in:

```bash
VITE_API_URL=https://your-api-url.example.com
```

The API should expose these resources:

- `GET /columns`
- `POST /columns`
- `PATCH /columns/:id`
- `DELETE /columns/:id`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `GET /assignees`

Task list requests use query params such as `_page`, `_per_page`, `_sort`, and `_where`.

### Run Locally

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Runs TypeScript project builds and creates a production build in `dist/`.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm run preview
```

Serves the production build locally for preview.

## Project Structure

```text
src/
  api/          Axios client and REST API functions
  components/   UI components organized as atoms, molecules, organisms, templates, and modals
  hooks/        TanStack Query hooks for columns, tasks, and assignees
  lib/          Shared providers and library setup
  pages/        Page-level React views
  stores/       Zustand stores for filters and modal state
  types/        Shared TypeScript domain types
```

## Data Model

### Column

```ts
type BoardColumn = {
  id: string;
  title: string;
  color: string;
  order: number;
};
```

### Task

```ts
type Task = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: "low" | "medium" | "high";
  assigneeIds: string[];
  order: number;
};
```

### Assignee

```ts
type Assignee = {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
};
```

## Notes

- `sketch.png` contains the provided design reference.
- The app uses fractional ordering helpers for drag-and-drop moves, so reordering only needs to update the moved item.
- No automated test script is currently configured.
