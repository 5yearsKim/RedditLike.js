"use client";

import React from "react";
import Link from "next/link";
import { Row, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

export function NavbarLogo() {

  return (
    <Row>
      <Link href='/'>
        <Box ml={1} mr={0.5}>
          <Txt variant='h6'>{"LOGO"}</Txt>
        </Box>
      </Link>
    </Row>
  );

}