import { useState } from "react";

type HoverProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTouchEnd: () => void;
};

export function useHover(): [boolean, HoverProps] {
  const [isHover, setIsHover] = useState<boolean>(false);
  const hoverProps = {
    onMouseEnter: (): void => setIsHover(true),
    onMouseLeave: (): void => setIsHover(false),
    onTouchEnd: (): void => setIsHover(false),
  };
  return [isHover, hoverProps];
}
