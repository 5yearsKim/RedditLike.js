export type UserSessionT = {
    user: {
        id: number;
        created_at: Date;
        updated_at?: Date | undefined;
        email: string;
        sub: string;
        deleted_at?: (Date | null) | undefined;
        last_login_at?: (Date | null) | undefined;
        points: number;
        notify_comment_on_comment: boolean;
        notify_comment_on_post: boolean;
        notify_trash_post: boolean;
        notify_trash_comment: boolean;
        allow_chat_push: boolean;
    };
    token: string;
    tokenExpAt: number;
}
