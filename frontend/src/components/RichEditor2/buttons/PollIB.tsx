import React from "react";
import { PollIcon } from "@/ui/icons";
import { ButtonProps } from "./type";
import { IB } from "./style";

interface PollIBProps extends ButtonProps {
  onClick: () => void;
}

export function PollIB(props: PollIBProps): JSX.Element {
  const { onClick } = props;

  function handleClick(): void {
    onClick();
  }

  return (
    <IB
      icon={<PollIcon/>}
      onClick={handleClick}
    />
  );
}
