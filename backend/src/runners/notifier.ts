// import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import { extractText } from "@/utils/formatter";
import { notificationM } from "@/models/Notification";
import { userM } from "@/models/User";
import { boardM } from "@/models/Board";
// import { pushNotiH } from "@/apis/PushNoti";
import { forwardSocketEvent } from "@/utils/socket";
import * as err from "@/errors";
import type {
  NotificationT, NotificationFormT,
  CommentOnCommentNotiFormT, CommentOnPostNotiFormT,
  TrashPostNotiFormT, TrashCommentNotiFormT,
  CreateManagerNotiFormT, DeleteManagerNotiFormT,
  PostT, CommentT, BoardManagerT, PostManagingLogT, CommentManagingLogT,
} from "@/types";


export class Notifier {
  // firebase messaging takes only string value
  private extractFbArg(arg: {[key: string]: any}): {[key: string]: string} {
    const newArg: {[key: string]: string} = {};
    for (const [key, val] of Object.entries(arg)) {
      if (typeof val === "string" || val instanceof String) {
        newArg[key] = val.toString();
      } else if (typeof val === "object") {
        newArg[key] = JSON.stringify(val);
      }
    }
    return newArg;
  }

  private async forwardNotifiction(noti: NotificationT): Promise<void> {
    const forwardEvent: NotificationCreatedEventT = {
      name: "notification-created",
      args: [noti],
    };
    await forwardSocketEvent(forwardEvent);
  }

  // private async forwardFcm(
  //   userId: idT,
  //   options: {title?: string, body: string, noti?: NotificationT|null, link?: string},
  // ): Promise<void> {

  //   const { title, body, link } = options;
  //   // send fcm push
  //   const pushNotis = await pushNotiM.findMany({ user_id: userId, is_allow: true });

  //   if (!pushNotis.length) {
  //     return;
  //   }

  //   const fcm: MulticastMessage = {
  //     // notification: {
  //     // },
  //     data: {
  //       // ...(arg ? this.extractFbArg(arg!) : undefined),
  //       title: title as any,
  //       body,
  //       tag: link ?? "",
  //       // link: link ?? '/',
  //     },
  //     tokens: pushNotis.map((item) => item.token),
  //     android: {
  //       collapseKey: "nuco-noti",
  //     },
  //     apns: {
  //       headers: {
  //         "apns-collapse-id": "nuco-noti",
  //       },
  //     },
  //     webpush: {
  //       fcmOptions: {
  //         link: link,
  //       },
  //     },
  //   };
  //   await getMessaging().sendMulticast(fcm);
  // }

  async test(receiverId: idT): Promise<void> {
    try {
      const notiForm: NotificationFormT = {
        user_id: receiverId,
        type: "test",
        message: "this is a test message",
      };
      const noti = await notificationM.create(notiForm);
      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }
      // const userInfo = await userInfoM.findById(receiverId);
      // if (!userInfo) {
      //   throw new err.NotExistE("author not exists");
      // }
      // await this.forwardFcm(userInfo.id, { body: noti.message });
    } catch (e) {
      console.warn(e);
    }
  }

  async commentOnComment(post: PostT, child: CommentT, parent: CommentT): Promise<void> {
    // if comment on myself
    if (child.author_id === parent.author_id) {
      return;
    }
    // if parent deleted
    if (parent.deleted_at || !parent.author_id) {
      return;
    }
    try {
      // check receiver setting
      const user = await userM.findById(parent.author_id);
      if (!user) {
        throw new err.NotExistE("author not exists");
      }
      // if user setting: receive noti
      if (user.notify_comment_on_comment === false) {
        return; // end process
      }

      // create noti
      const parentSmr = extractText(parent.body ?? "", parent.body_type, { ellipsis: true });
      const childSmr = extractText(child.body ?? "", child.body_type, { ellipsis: true, maxLen: 50 });
      const message = `내 댓글 '${parentSmr}'에 답글 '${childSmr}'`;

      const notiForm: CommentOnCommentNotiFormT = {
        user_id: parent.author_id,
        board_id: post.board_id,
        type: "commentOnComment",
        message,
        arg: {
          parentId: parent.id,
          childId: child.id,
          parent: parent,
          child: child,
        },
      };
      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);
      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }

      await this.forwardNotifiction(noti);
      // await this.forwardFcm(userInfo.id, {
      //   title: "새 답글",
      //   body: message,
      //   noti: noti,
      //   link: `/posts/${post.id}?commentId=${child.id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }


  async commentOnPost(post: PostT, comment: CommentT): Promise<void> {
    // if author not exists
    if (!post.author_id) {
      return;
    }
    // if comment on myself
    if (post.author_id === comment.author_id) {
      return;
    }
    if (post.deleted_at) {
      return;
    }
    try {
      // check receiver setting
      const user = await userM.findById(post.author_id);
      if (!user) {
        throw new err.NotExistE("author not exists");
      }
      // if user setting: receive noti
      if (user.notify_comment_on_post === false) {
        return; // end process
      }

      // create noti
      const postSmr = extractText(post.title, "text", { ellipsis: true });
      const commentSmr = extractText(comment.body ?? "", comment.body_type, { ellipsis: true, maxLen: 50 });
      const message = `내 게시글 '${postSmr}'에 댓글 '${commentSmr}'`;

      const notiForm: CommentOnPostNotiFormT = {
        user_id: post.author_id,
        board_id: post.board_id,
        type: "commentOnPost",
        message,
        arg: {
          postId: post.id,
          commentId: comment.id,
          post: post,
          comment: comment,
        },
      };
      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);
      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }

      await this.forwardNotifiction(noti);
      // await this.forwardFcm(userInfo.id, {
      //   title: "새 댓글",
      //   body: message,
      //   noti: noti,
      //   link: `/posts/${post.id}?commentId=${comment.id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }

  async createManager(manager: BoardManagerT): Promise<void> {
    try {
      const board = await boardM.findById(manager.board_id);
      if (!board) {
        throw new err.NotExistE("board not exists");
      }
      const notiForm: CreateManagerNotiFormT = {
        type: "createManager",
        user_id: manager.user_id,
        board_id: manager.board_id,
        message: `게시판 '${board.name}'의 매니저로 추가되었어요.`,
        arg: {
          boardId: manager.board_id,
          userId: manager.user_id,
          board: board,
        },
      };
      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);

      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }

      await this.forwardNotifiction(noti);
      // await this.forwardFcm(manager.user_id, {
      //   title: "게시판 매니저 추가",
      //   body: noti.message,
      //   noti: noti,
      //   link: `/boards/${manager.board_id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }

  async deleteManager(manager: BoardManagerT): Promise<void> {
    try {
      const board = await boardM.findById(manager.board_id);
      if (!board) {
        throw new err.NotExistE("board not exists");
      }
      const notiForm: DeleteManagerNotiFormT = {
        type: "deleteManager",
        user_id: manager.user_id,
        board_id: manager.board_id,
        message: `게시판 '${board.name}'의 매니저에서 제외되었어요.`,
        arg: {
          boardId: manager.board_id,
          userId: manager.user_id,
          board: board,
        },
      };
      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);

      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }

      await this.forwardNotifiction(noti);
      // await this.forwardFcm(manager.user_id, {
      //   title: "게시판 매니저 제외",
      //   body: noti.message,
      //   noti: noti,
      //   link: `/boards/${manager.board_id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }

  async trashPost(managingLog: PostManagingLogT, post: PostT): Promise<void> {
    if (!post.author_id) {
      return;
    }
    try {
      // check receiver setting
      const user = await userM.findById(post.author_id);
      if (!user) {
        throw new err.NotExistE("receiver not exists");
      }

      if (user.notify_trash_post === false) {
        return; // end process
      }

      const notiForm: TrashPostNotiFormT = {
        type: "trashPost",
        user_id: post.author_id,
        board_id: post.board_id,
        message: `내 게시글 '${post.title}'이 ${post.trashed_by == "admin" ? "관리자" : "게시판 매니저"}에 의해 숨김처리 되었어요. (${managingLog.memo})`,
        arg: {
          postId: post.id,
          managingLog: managingLog,
          post: post,
        },
      };

      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);

      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }
      await this.forwardNotifiction(noti);
      // await this.forwardFcm(userInfo.id, {
      //   title: "내 게시글 숨겨짐",
      //   body: noti.message,
      //   noti: noti,
      //   link: `/posts/${post.id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }

  async trashComment(managingLog: CommentManagingLogT, comment: CommentT): Promise<void> {
    if (!comment.author_id) {
      return;
    }
    try {
      // check receiver setting
      const user = await userM.findById(comment.author_id);
      if (!user) {
        throw new err.NotExistE("receiver not exists");
      }

      if (user.notify_trash_comment === false) {
        return; // end process
      }

      const notiForm: TrashCommentNotiFormT = {
        type: "trashComment",
        user_id: comment.author_id,
        board_id: managingLog.board_id,
        message: `내 댓글 '${extractText(comment.body ?? "", comment.body_type)}'이 ${comment.trashed_by == "admin" ? "관리자" : "게시판 매니저"}에 의해 숨김처리 되었어요. (${managingLog.memo})`,
        arg: {
          postId: comment.post_id,
          commentId: comment.id,
          managingLog: managingLog,
          comment: comment,
        },
      };

      const created = await notificationM.create(notiForm);
      const noti = await notificationM.findById(created!.id);

      if (!noti) {
        throw new err.NotAppliedE("noti not created");
      }
      await this.forwardNotifiction(noti);
      // await this.forwardFcm(userInfo.id, {
      //   title: "내 댓글 숨겨짐",
      //   body: noti.message,
      //   noti: noti,
      //   link: `/posts/${comment.post_id}`,
      // });
    } catch (e) {
      console.warn(e);
    }
  }
}