"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import { ErrorIcon, HomeIcon } from "@/ui/icons";
import { Container, Gap, Row, Col } from "@/ui/layouts";
import { Txt } from "@/ui/texts";

export default function NotFound(): JSX.Element {
  const pathname = usePathname();


  return (
    <Container>
      <Box height='80vh'>
        <Col
          height='100%'
          alignItems='center'
          justifyContent='center'
        >
          <Row>
            <ErrorIcon sx={{ color: "vague.main" }} />
            <Gap x={1} />
            <Txt
              variant='body1'
              color='vague.main'
            >
              해당 페이지를 찾을 수 없어요.
            </Txt>
          </Row>

          <Gap y={1} />

          <Txt color='vague.light'>{pathname}</Txt>

          <Gap y={2} />

          <Link href='/'>
            <Button
              startIcon={<HomeIcon />}
              variant='contained'
            >
              홈으로
            </Button>
          </Link>
        </Col>
      </Box>
    </Container>
  );
}