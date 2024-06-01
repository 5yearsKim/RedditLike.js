import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Box, Button } from "@mui/material";
import { AccountIcon, EditIcon } from "@/ui/icons";
import { Flair } from "@/components/Flair";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AuthorAvatar } from "@/ui/tools/Avatar";
// import { FlairSelector } from '../FlairSelector';
import { AuthorSelector } from "@/components/AuthorSelector";
import { AuthorPreviewProps, useLogic } from "./logic";

export function AuthorPreview(props: AuthorPreviewProps): JSX.Element {
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

  const status = boardMain$.status;

  if (status !== "loaded") {
    return <></>;
  }

  const { author, board } = boardMain$.data!;

  if (author == null) {
    return <></>;
  }

  function renderAuthor(): JSX.Element {
    if (!author) {
      throw new Error("author not null");
    }
    const sz = "50px";

    return (
      <Row alignItems='center'>
        <AuthorAvatar
          author={author}
          size={sz}
        />
        <Gap x={1} />
        <Col>
          <Txt variant='subtitle2'>{author.nickname ?? author.default_nickname ?? t("anonymous")}</Txt>

          {author.use_flair && (
            <Row
              flexWrap='wrap'
              columnGap={0.5}
            >
              {author.flairs.map((flair) => {
                return (
                  <Flair
                    key={flair.id}
                    flair={flair}
                    size='sm'
                  />
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    );
  }

  return (
    <Fragment>
      <Box
        bgcolor='paper.main'
        borderRadius={1}
        width='100%'
        p={2}
        boxShadow='0 0 4px 2px rgba(0, 0, 0, 0.1)'
        mb={2}
      >
        <Col alignItems='center'>
          {renderAuthor()}
          <Gap y={2} />
          <Button
            fullWidth
            variant='outlined'
            startIcon={<AccountIcon />}
            onClick={handleEditAuthorClick}
          >
            {t("edit")}
          </Button>

          {createPostDisabled !== true && (
            <>
              <Gap y={1} />
              <Button
                fullWidth
                variant='contained'
                startIcon={<EditIcon />}
                onClick={handleCreatePostClick}
              >
                {t("createPost")}
              </Button>
            </>
          )}
        </Col>
      </Box>

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
            board={board}
            author={author}
            onApply={handleSelectorApply}
            onCancel={handleSelectorClose}
          />
        </Box>
      </Dialog>
    </Fragment>
  );
}
