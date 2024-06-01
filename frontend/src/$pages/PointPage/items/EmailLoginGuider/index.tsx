import React from "react";
import { Box } from "@mui/material";
import { Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EmailCheckIcon } from "@/ui/icons";

export function EmailLoginGuider(): JSX.Element {
  return (
    <Box
      width='360px'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <EmailCheckIcon sx={{ color: "vague.light", fontSize: 40 }} />
      <Gap y={1} />
      <Txt
        color='vague.main'
        textAlign='center'
      >
        포인트 기능을 이용하려면 이메일 인증이 필요해요. 상단 계정 아이콘을 눌러 이메일 인증을 진행해주세요.
      </Txt>
    </Box>
  );
}
