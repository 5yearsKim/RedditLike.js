import React, { MouseEvent, ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { IconButton, Box } from "@mui/material";
import { Row, Col, Center, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon, CheckIcon } from "@/ui/icons";
import { Clickable } from "@/ui/tools/Clickable";
import { vizTime } from "@/utils/time";
import type { PostT } from "@/types";

type DraftPostItemProps = {
  post: PostT;
  isChecked?: boolean;
  onClick: (post: PostT) => any;
  onDelete: (post: PostT) => any;
};

export function DraftPostItem({
  post,
  isChecked,
  onClick,
  onDelete,
}: DraftPostItemProps): ReactNode {
  const locale = useLocale();
  const t = useTranslations("components.PostEditor.PostDraftBox.DraftPostItem");

  function handleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    onClick(post);
  }

  function handleDeleteClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    onDelete(post);
  }
  return (
    <Clickable onClick={handleClick}>
      <Row
        width='100%'
        py={0.5}
      >
        <Center width='20px'>{isChecked && <CheckIcon color='success' />}</Center>
        <Col flex={10}>
          <Txt
            fontWeight={700}
            textOverflow='ellipsis'
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.title}
          </Txt>
          <Row>
            <Txt
              variant='body3'
              color='vague.main'
            >
              {vizTime(post.updated_at ?? post.created_at, { type: "relative", locale })}
            </Txt>
            <Expand />
            {post.reserved_at && (
              <Txt
                variant='body3'
                color='vague.main'
              >
                {t("reservedAt")}: {vizTime(post.reserved_at, { type: "absolute", locale })}
              </Txt>
            )}
          </Row>
        </Col>

        <Box flex={1}>
          <IconButton onClick={handleDeleteClick}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Row>
    </Clickable>
  );
}
