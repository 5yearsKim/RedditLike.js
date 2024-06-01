import React from "react";
import { useUrlState } from "@/hooks/UrlState";
import { IconButton, Dialog, Box, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { SlideTransition } from "@/ui/tools/SlideTransition";
import { UnfoldIcon, CloseIcon, HelpOlIcon } from "@/ui/icons";

type QnAT = {
  q: string;
  a: string;
};
const qnas: QnAT[] = [
  {
    q: "포인트는 어떻게 산정되나요?",
    a: "하루 단위로 누코스토리의 광고 수입과 마케팅 예산을 합산한 금액을 조회수와 좋아요 수를 기준으로 나누어 유저들의 포인트를 집계해요. ",
  },
  {
    q: "포인트와 교환한 기프티콘은 취소할 수 있나요?",
    a: "교환 이후 3일 이내에 기프티콘을 취소할 수 있어요. 사용한 포인트는 환불돼요.",
  },
  {
    q: "글을 마구 적어서 포인트를 모아도 되나요?",
    a: "누코스토리에서는 각 게시판을 관리하는 매니저가 게시글을 관리해요. 게시판 매니저가 규칙 위반으로(도배, 욕설 등 게시판 수칙 위반) 내 글을 삭제할 경우 포인트가 차감되니 주의해주세요.",
  },
  {
    q: "작성 날로부터 며칠까지 포인트를 받을 수 있나요?",
    a: "글 작성 이후 7일까지 조회수와 좋아요를 기준으로 포인트를 받을 수 있어요.",
  },
  {
    q: "기프티콘 사용 기간이 만료됐는데 환불 받을 수 있나요?",
    a: "기프티콘 사용 기간이 지나면 기프티콘을 사용할 수 없어요. 이후 교환 또는 환불이 불가하니 유의해주세요.",
  },
];

export function PointHelperIcon(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useUrlState<boolean>({
    key: "pointHelper",
    val2query: (val) => val ? "true" : null,
    query2val: (query) => query == "true",
    backOn: (val) => !val,
  });

  function handleClick(): void {
    setDialogOpen(true);
  }

  function handleDialogClose(): void {
    setDialogOpen(false);
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <HelpOlIcon />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        TransitionComponent={SlideTransition}
        fullWidth
        maxWidth='sm'
      >
        <Box p={2}>
          <Txt variant='h5'>리워드란?</Txt>

          <Gap y={2} />

          <Txt color='vague.dark'>
            사람들이 내가 글을 많이 보고 좋아요를 누를 수록 나에게 포인트가 지급돼요. 받은 포인트를 샵에서 기프티콘과
            교환할 수 있어요.{" "}
          </Txt>

          <Gap y={4} />

          <Txt variant='h5'>자주 묻는 질문</Txt>

          <Gap y={2} />

          {qnas.map((item, idx) => {
            return (
              <Accordion
                key={idx}
                square
              >
                <AccordionSummary expandIcon={<UnfoldIcon />}>
                  <Txt
                    variant='body2'
                    fontWeight={500}
                  >
                    {item.q}
                  </Txt>
                </AccordionSummary>
                <AccordionDetails>
                  <Txt variant='body2'>{item.a}</Txt>
                </AccordionDetails>
              </Accordion>
            );
          })}

          <Gap y={4} />

          <Row justifyContent='center'>
            <Button
              startIcon={<CloseIcon />}
              variant='contained'
              size='small'
              onClick={handleDialogClose}
              sx={{
                borderRadius: 8,
              }}
            >
              닫기
            </Button>
          </Row>
        </Box>
      </Dialog>
    </>
  );
}
