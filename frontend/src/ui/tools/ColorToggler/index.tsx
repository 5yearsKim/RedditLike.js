import React, { MouseEvent } from "react";
import { ToggleBox } from "./style";

type ColorTogglerProps = {
  color?: string;
  size?: string;
  onColorChange: (color: string) => void;
};

export function ColorToggler({
  color,
  size,
  onColorChange,
}: ColorTogglerProps): JSX.Element {

  function handleColorToggle(e: MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
    e.preventDefault();
    let _color = "";
    if (color == "#ffffff") {
      _color = "#000000";
    } else {
      _color = "#ffffff";
    }
    onColorChange(_color);
  }

  return (
    <ToggleBox
      isDark={!(color == "#ffffff" || color == "#fff")}
      size={size}
      onClick={handleColorToggle}
    >
      Aa
    </ToggleBox>
  );
}
