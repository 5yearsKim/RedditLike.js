import React from "react";
import { Center } from "@/ui/layouts";

export function FullBox({ isFull, children }: { isFull: boolean; children: JSX.Element }): JSX.Element {
  if (!isFull) {
    return children;
  } else {
    return (
      <Center
        width='100vw'
        height='100vh'
      >
        {children}
      </Center>
    );
  }
}
