import React from "react";
import { useTranslations } from "next-intl";
import { Row, Box, Center } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { AuthorAvatar } from "@/ui/tools/Avatar";
import { Flair } from "@/components/Flair";
import { extractNameFromAuthor } from "./utils";
import type { AuthorT } from "@/types";

export type BoardAuthorPreviewProps = {
  author: AuthorT | null;
  showAvatar?: boolean;
  showFlair?: boolean;
  textVariant?: "body2" | "body3";
  renderInfo?: () => JSX.Element;
};

export function BoardAuthorPreview(props: BoardAuthorPreviewProps): JSX.Element {
  const t = useTranslations("components.BoardAuthor");
  const { author, showAvatar, showFlair, textVariant: _tVar, renderInfo } = props;

  const textVariant = _tVar ?? "body2";

  if (!author || author.deleted_at) {
    return (
      <Txt
        variant={textVariant}
        color='vague.light'
      >
        ({t("unknown")})
      </Txt>
    );
  }

  const Avat = (): JSX.Element => {
    const sz = "22px";
    return (
      <Box mr={1}>
        <AuthorAvatar
          author={author}
          size={sz}
        />
      </Box>
      // <Avatar
      //   src={extractAvatarFromAuthor(author)}
      //   sx={{ width: sz, height: sz, userSelect: 'none', pointerEvents: 'none', marginRight: 0.75 }}
      // />
    );
  };

  return (
    <Row
      sx={{ opacity: 0.6 }}
      flexWrap='nowrap'
      overflow='hidden'
    >
      {showAvatar && <Avat />}
      <Txt
        variant={textVariant}
        fontWeight={500}
        whiteSpace='nowrap'
      >
        {extractNameFromAuthor(author, t("anonymous"))}
      </Txt>
      {showFlair && author.use_flair && (author.flairs ?? []).length > 0 && (
        <Row alignItems='cener'>
          <Center minWidth={10}>
            <Txt
              variant='body3'
              fontWeight={500}
            >
              ·
            </Txt>
          </Center>
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
        </Row>
      )}
      {renderInfo && renderInfo()}
    </Row>
  );
}
