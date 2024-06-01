"use client";
import React, { useMemo, ReactNode } from "react";
import { StyledTab } from "./style";
// logic
import { usePathname } from "next/navigation";
import { useHover } from "@/hooks/Hover";

type FocusTabProps = {
  children: ReactNode;
  isFocused: (path: string) => boolean;
  onClick?: () => void;
};

export function FocusTab({
  children,
  isFocused,
  onClick,
}: FocusTabProps): ReactNode {
  const pathname = usePathname();
  const [isHover, hoverProps] = useHover();

  const focused = useMemo(() => {
    return isHover || isFocused(pathname);
  }, [pathname, isHover]);

  function handleClick(): void {
    if (onClick) {
      onClick();
    }
  }

  return (
    <StyledTab
      borderBottom={2}
      {...hoverProps}
      focused={focused}
      onClick={handleClick}
    >
      {children}
    </StyledTab>
  );
}
