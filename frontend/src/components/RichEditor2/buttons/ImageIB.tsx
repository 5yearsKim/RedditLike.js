import React from "react";
import { ImageIcon } from "@/ui/icons";
import { ButtonProps } from "./type";
import { IB } from "./style";

interface ImageIBProps extends ButtonProps {
  onClick: () => void;
}

export function ImageIB(props: ImageIBProps): JSX.Element {
  const { onClick } = props;

  function handleClick(): void {
    onClick();
  }

  return (
    <IB
      icon={<ImageIcon />}
      onClick={handleClick}
    />
  );
}
