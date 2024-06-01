import React from "react";
import { useTranslations } from "next-intl";
import { Row, Col, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AuthorAvatar } from "@/ui/tools/Avatar";
import { Avatar, Box } from "@mui/material";
import { Flair } from "@/components/Flair";
import { extractNameFromAuthor } from "./utils";
import type { AuthorT } from "@/types";

export type BoardAuthorProps = {
  author: AuthorT | null;
  size?: "medium" | "small";
  renderInfo?: () => JSX.Element;
};

export function BoardAuthor({
  author,
  size,
  renderInfo,
}: BoardAuthorProps): JSX.Element {
  const t = useTranslations("components.BoardAuthor");

  let textVariant = "body2";
  let avatarSize = "28px";
  if (size === "small") {
    textVariant = "body3";
    avatarSize = "22px";
  }

  if (!author || author.deleted_at) {
    return (
      <Row>
        <Avatar sx={{ width: avatarSize, height: avatarSize }} />
        <Box mr={0.5} />
        <Txt
          variant={textVariant as any}
          color='vague.light'
        >
          ({t("unknown")})
        </Txt>
      </Row>
    );
  }

  return (
    <Row>
      <AuthorAvatar
        author={author}
        size={avatarSize}
      />
      <Gap x={1} />
      <Col
        alignItems='flex-start'
        rowGap={0.25}
        flex={1}
      >
        {/* nickname */}
        <Row position='relative'>
          <Box>
            <Txt
              variant={textVariant as any}
              fontWeight={500}
              whiteSpace='nowrap'
            >
              {extractNameFromAuthor(author, t("anonymous"))}
            </Txt>
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              transform: "translateX(100%)",
            }}
            onClick={(e): void => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {renderInfo && renderInfo()}
          </Box>
        </Row>
        {/* flairs */}
        <Row
          flexWrap='wrap'
          columnGap={0.25}
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
      </Col>
    </Row>
  );
}
