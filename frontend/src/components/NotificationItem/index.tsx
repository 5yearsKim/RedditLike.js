import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { alpha } from "@mui/material";
import { yellow } from "@mui/material/colors";
import { Row, Col, Gap, Expand } from "@/ui/layouts";
import { Txt, EllipsisTxt } from "@/ui/texts";
import { Avatar, BoardAvatar } from "@/ui/tools/Avatar";
import { Clickable } from "@/ui/tools/Clickable";
import { vizTime } from "@/utils/time";
// logic
import { useMemo } from "react";
import { extractText } from "@/utils/html";
import type {
  NotificationT,
  CommentOnCommentNotiFormT,
  CommentOnPostNotiFormT,
  CreateManagerNotiFormT,
  DeleteManagerNotiFormT,
  TrashPostNotiFormT,
  TrashCommentNotiFormT,
} from "@/types";


type NotificationItemProps = {
  notification: NotificationT;
  markUnreadDisabled?: boolean;
  onClick?: () => any;
};


export function NotificationItem({
  notification,
  markUnreadDisabled,
  onClick: onClickCommon,
}: NotificationItemProps): JSX.Element {
  const t = useTranslations("components.NotificationItem");
  const locale = useLocale();
  const router = useRouter();

  const [body, onClick] = useMemo(() => {
    try {
      let body = "";
      let onClick: () => any = () => null;

      switch (notification.type) {
      case "commentOnPost": {
        const form: CommentOnPostNotiFormT = notification as any;
        const { post, comment } = form.arg;

        body = t("commentOnPostMsg", {
          postTitle: post.title,
          commentBody: extractText(comment.body ?? "", comment.body_type, { maxLen: 16, ellipsis: true }),
        });
        onClick = (): void => {
          router.replace(`/posts/${post.id}?commentId=${comment.id}`);
        };
        break;
      }
      case "commentOnComment": {
        const form: CommentOnCommentNotiFormT = notification as any;
        const { parent, child } = form.arg;
        // body = `내 댓글 '${extractText(parent.body ?? "", parent.body_type, {
        //   ellipsis: true,
        //   maxLen: 16,
        // })}'에 답글 '${extractText(child.body ?? "", child.body_type)}'`;
        body = t("commentOnCommentMsg", {
          parentBody: extractText(parent.body ?? "", parent.body_type, { maxLen: 16, ellipsis: true }),
          childBody: extractText(child.body ?? "", child.body_type, { maxLen: 16, ellipsis: true }),
        });
        onClick = (): void => {
          router.replace(`/posts/${child.post_id}?commentId=${child.id}`);
        };
        break;
      }
      case "createManager": {
        const form: CreateManagerNotiFormT = notification as any;
        body = t("createManagerMsg", { boardName: form.arg.board.name });
        onClick = (): void => {
          router.replace(`/boards/${form.arg.board.id}`);
        };
        break;
      }
      case "deleteManager": {
        const form: DeleteManagerNotiFormT = notification as any;
        body = t("deleteManagerMsg", { boardName: form.arg.board.name });
        onClick = (): void => {
          router.replace(`/boards/${form.arg.board.id}`);
        };
        break;
      }
      case "trashPost": {
        const form: TrashPostNotiFormT = notification as any;
        body = `내 글 '${form.arg.post.title}'이(가) 삭제되었어요. 이유: ${form.arg.managingLog.memo}`;
        body = t("trashPostMsg", {
          postTitle: form.arg.post.title,
          reason: form.arg.managingLog.memo,
        });
        onClick = (): void => {
          router.replace(`/posts/${form.arg.postId}`);
        };
        break;
      }
      case "trashComment": {
        const form: TrashCommentNotiFormT = notification as any;
        body = t("trashCommentMsg", {
          commentBody: extractText(form.arg.comment.body ?? "", form.arg.comment.body_type, { maxLen: 16, ellipsis: true }),
          reason: form.arg.managingLog.memo,
        });
        onClick = (): void => {
          router.replace(`/posts/${form.arg.postId}`);
        };
        break;
      }
      default:
        break;
      }
      return [body, onClick];
    } catch (e) {
      console.warn("error on decoding noti: ", e);
      return ["", (): void => {}];
    }
  }, []);

  function handleClick(): void {
    onClick();
    if (onClickCommon) {
      onClickCommon();
    }
  }


  return (
    <Clickable
      onClick={handleClick}
      width='100%'
      borderRadius={0}
      px={2}
      py={0.5}
      // minHeight='300px'
      sx={
        markUnreadDisabled
          ? undefined
          : {
            backgroundColor: notification.is_checked ? undefined : alpha(yellow[200], 0.2),
          }
      }
    >
      <Row width='100%'>
        {notification.board ? <BoardAvatar board={notification.board} /> : <Avatar />}

        <Gap x={1} />

        <Expand>
          <Col>
            <Row>
              {notification.board && (
                <Txt
                  variant='body2'
                  fontWeight={500}
                >
                  {notification.board.name}
                </Txt>
              )}
              <Expand />
              <Txt
                variant='body3'
                color='vague.main'
                fontWeight={500}
              >
                {vizTime(notification.created_at, { type: "relative", locale })}
              </Txt>
            </Row>

            <Row>
              <EllipsisTxt maxLines={2}>{body}</EllipsisTxt>
            </Row>
          </Col>
        </Expand>
      </Row>
    </Clickable>
  );
}
