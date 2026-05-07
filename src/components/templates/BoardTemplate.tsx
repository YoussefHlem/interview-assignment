import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export interface BoardTemplateProps {
  children: ReactNode;
  header: ReactNode;
  sx?: SxProps<Theme>;
}

export function BoardTemplate({ children, header, sx }: BoardTemplateProps) {
  return (
    <Box
      sx={[
        {
          bgcolor: "grey.50",
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {header}
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
