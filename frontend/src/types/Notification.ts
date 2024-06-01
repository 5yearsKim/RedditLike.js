export type NotificationTypeT = "test" | "commentOnPost" | "commentOnComment" | "createManager" | "deleteManager" | "trashPost" | "trashComment"

export type NotificationFormT = {
    user_id: number;
    board_id?: (number | null) | undefined;
    type: "test" | "commentOnPost" | "commentOnComment" | "createManager" | "deleteManager" | "trashPost" | "trashComment";
    message: string;
    arg?: any;
    is_checked?: (boolean | null) | undefined;
}

type _NotificationT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    user_id: number;
    board_id?: (number | null) | undefined;
    type: "test" | "commentOnPost" | "commentOnComment" | "createManager" | "deleteManager" | "trashPost" | "trashComment";
    message: string;
    arg?: any;
    is_checked?: (boolean | null) | undefined;
}

export type GetNotificationOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $board?: boolean | undefined;
}

export type ListNotificationOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $board?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    type?: ("test" | "commentOnPost" | "commentOnComment" | "createManager" | "deleteManager" | "trashPost" | "trashComment") | undefined;
    boardId?: number | undefined;
}


// @type-gen remain
import type { BoardT } from "./Board";

export interface NotificationT extends _NotificationT {
  board?: BoardT
}


// notification type
import type { CommentT } from "./Comment";
import type { PostT } from "./Post";
import type { PostManagingLogT } from "./PostManagingLog";
import type { CommentManagingLogT } from "./CommentManagingLog";

export interface CommentOnPostNotiFormT extends NotificationFormT {
  type: "commentOnPost"
  arg: {
    commentId: idT
    postId: idT
    comment: CommentT
    post: PostT
  }
}

export interface CommentOnCommentNotiFormT extends NotificationFormT {
  type: "commentOnComment"
  arg: {
    parentId: idT
    childId: idT
    parent: CommentT
    child: CommentT
  }
}

export interface CreateManagerNotiFormT extends NotificationFormT {
  type: "createManager",
  arg: {
    boardId: idT
    userId: idT
    board: BoardT
  }
}

export interface DeleteManagerNotiFormT extends NotificationFormT {
  type: "deleteManager",
  arg: {
    boardId: idT
    userId: idT
    board: BoardT
  }
}

export interface TrashPostNotiFormT extends NotificationFormT {
  type: "trashPost",
  arg: {
    postId: idT
    managingLog: PostManagingLogT
    post: PostT
  }
}

export interface TrashCommentNotiFormT extends NotificationFormT {
  type: "trashComment",
  arg: {
    postId: idT
    commentId: idT
    managingLog: CommentManagingLogT
    comment: CommentT
  }
}