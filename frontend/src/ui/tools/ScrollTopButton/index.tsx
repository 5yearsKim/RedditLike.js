"use client";
import React, { ReactNode } from "react";
import { Fab, Zoom } from "@mui/material";
import { ScrollTopIcon } from "@/ui/icons";
import { useState, useEffect } from "react";

export type ScrollTopButtonProps = {
  threshold?: number;
  size?: "large" | "medium" | "small";
};


export function ScrollTopButton({
  threshold,
  size,
}: ScrollTopButtonProps): ReactNode {

  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const handleShowButton = (): void => {
      const mThreshold = threshold ?? 500;
      if (window.scrollY > mThreshold) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return (): void => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  function handleClick(): void {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <Zoom in={showButton}>
      <Fab
        color='primary'
        size={size}
        onClick={handleClick}
      >
        <ScrollTopIcon fontSize='large' />
      </Fab>
    </Zoom>
  );
}
