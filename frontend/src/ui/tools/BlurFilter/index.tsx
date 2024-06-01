import React, { useRef, ReactNode } from "react";
import { Box } from "@mui/material";

type BlurFilterProps = {
  children: ReactNode;
  hide: boolean;
  message?: ReactNode;
  radius?: string;
  onClick?: () => void;
};

export function BlurFilter({
  children,
  hide,
  message,
  radius,
  onClick,
}: BlurFilterProps): ReactNode {

  const childrenRef = useRef<HTMLDivElement | null>(null);
  const childrenWidth = childrenRef.current?.offsetWidth ?? 1000;
  const defaultBlur = childrenWidth * 0.03 + 2 + "px";

  if (!hide) {
    return children;
  } else {
    return (
      <Box
        position='relative'
        onClick={onClick}
      >
        {message && (
          <Box
            position='absolute'
            width='100%'
            height='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'
            zIndex={10}
          >
            {message}
          </Box>
        )}
        <Box
          sx={{
            filter: `blur(${radius ?? defaultBlur})`,
          }}
        >
          <div ref={childrenRef}>{children}</div>
        </Box>
      </Box>
    );
  }
}
