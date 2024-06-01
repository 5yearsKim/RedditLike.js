import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box } from "@mui/material";
import { EditIcon } from "@/ui/icons";
import { BoardAuthor } from "@/components/BoardAuthor";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
// import { FlairSelector } from '../FlairSelector';
import { AuthorSelector } from "@/components/AuthorSelector";
import { Clickable } from "@/ui/tools/Clickable";
import { AuthorPreviewProps, useLogic } from "./logic";

export function AuthorPreviewMb(props: AuthorPreviewProps): JSX.Element {
  const {
    boardMain$,
    selectorOpen,
    createPostDisabled,
    handleEditAuthorClick,
    handleSelectorApply,
    handleSelectorClose,
    handleCreatePostClick,
  } = useLogic(props);

  const t = useTranslations("pages.BoardMainPage.AuthorPreview");


  if ( boardMain$.status !== "loaded" ) {
    return <></>;
  }
  const { author, board } = boardMain$.data!;

  if (author == null) {
    return <></>;
  }

  function renderMain(): JSX.Element {
    if (createPostDisabled) {
      return (
        <Row>
          <Clickable
            px={1}
            py={0.5}
            borderRadius={1}
            onClick={handleEditAuthorClick}
          >
            <BoardAuthor author={author} />
          </Clickable>
        </Row>
      );
    } else {
      return (
        <Row>
          <Box
            width='100%'
            bgcolor='paper.main'
            borderRadius={2}
            py={1}
            px={1}
            sx={{
              cursor: "pointer",
              boxShadow: "0px 0px 2px rgba(0,0,0, 0.1)",
            }}
            // onClick={handleCreateClick}
          >
            <Row>
              <Clickable
                px={1}
                borderRadius={1}
                onClick={handleEditAuthorClick}
              >
                <BoardAuthor author={author} />
              </Clickable>

              <Gap x={1} />

              <Row
                width='100%'
                minHeight={36}
                borderRadius={1}
                justifyContent='center'
                sx={{
                  border: "1.5px dashed #bbbbbb",
                }}
                onClick={handleCreatePostClick}
              >
                <EditIcon sx={{ fontSize: 20, color: "vague.light" }} />
                <Gap x={1} />
                <Txt
                  variant='body3'
                  color='vague.main'
                >
                  {t("write")}
                </Txt>
              </Row>
            </Row>
          </Box>
        </Row>
        // <Box
        //   flex={1}
        //   display='flex'
        //   justifyContent='center'
        //   alignItems='center'
        //   border='2px dashed #cccccc'
        //   minHeight='40px'
        //   onClick={handleCreatePostClick}
        // >
        //   <AddIcon sx={{ color: 'vague.main' }}/>
        //   <Txt variant='body3' fontWeight={500} color='vague.main'>글쓰기</Txt>
        // </Box>
      );
    }
  }

  return (
    <Fragment>
      {renderMain()}

      <Dialog
        fullWidth
        open={selectorOpen}
        onClose={handleSelectorClose}
      >
        <Box
          py={2}
          px={2}
        >
          <AuthorSelector
            author={author}
            board={board}
            onApply={handleSelectorApply}
            onCancel={handleSelectorClose}
          />
        </Box>
      </Dialog>
    </Fragment>
  );
}
