import Box from "@mui/material/Box";

import { Header } from "@/components/organisms";
import { BoardTemplate } from "@/components/templates/BoardTemplate.tsx";

export function BoardPage() {
  return (
    <BoardTemplate header={<Header />}>
      <Box
        aria-label="Board columns"
        sx={{
          display: "flex",
          flex: 1,
          gap: 2,
          minHeight: 0,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      />
    </BoardTemplate>
  );
}
