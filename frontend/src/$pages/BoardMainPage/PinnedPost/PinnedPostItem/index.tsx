import React from "react";
import { useLocale } from "next-intl";
import { Clickable } from "@/ui/tools/Clickable";
import { vizTime } from "@/utils/time";
import { Row, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import type { PostT } from "@/types/Post";

type PinnedPostProps = {
  post: PostT;
  onClick: () => void;
};

export function PinnedPostItem({
  post,
  onClick,
}: PinnedPostProps): JSX.Element {
  const locale = useLocale();
  return (
    <Clickable
      onClick={onClick}
      borderRadius={0}
    >
      <Row
        justifyContent='flex-start'
        width='100%'
        px={1}
      >
        <Expand>
          <Txt
            variant='body1'
            fontWeight={500}
          >
            {post.title}
          </Txt>
        </Expand>
        <Txt
          variant='body2'
          color='vague.main'
        >
          {vizTime(post.published_at, { type: "relative", locale })}
        </Txt>
      </Row>
    </Clickable>
  );
}
