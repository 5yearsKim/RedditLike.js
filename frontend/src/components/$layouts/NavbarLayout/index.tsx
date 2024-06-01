import React, { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Box } from "@/ui/layouts";
import { NAV_HEIGHT } from "@/ui/global";


type NavbarLayoutProps = {
  children: ReactNode
}

export function NavbarLayout({
  children,
}: NavbarLayoutProps) {
  return (
    <>
      <Box
        position='fixed'
        boxShadow={1}
        height={NAV_HEIGHT}
        bgcolor='paper.main'
        width='100%'
        zIndex='100'
      >
        <Navbar/>
      </Box>
      <Box
        pt={`${NAV_HEIGHT}px`}
      >
        {children}
      </Box>
    </>
  );
}