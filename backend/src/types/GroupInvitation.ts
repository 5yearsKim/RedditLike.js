export type InviteStatusT = "alreadyMember" | "pending" | "accepted" | "declined"

export type GroupInvitationFormT = {
    group_id: number;
    email: string;
    declined_at?: (Date | null) | undefined;
}

export type GroupInvitationT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    group_id: number;
    email: string;
    declined_at?: (Date | null) | undefined;
}

export type GetGroupInvitationOptionT = {
    userId?: number | undefined;
    groupId?: number | undefined;
}

export type ListGroupInvitationOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: number | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    sort?: ("recent" | "old") | undefined;
    email?: string | undefined;
    declined?: ("only" | "except") | undefined;
}
