export type PointEventFormT = {
    post_id: number | null;
    report_date: string;
    user_id: number | null;
    type: "post_summary";
    arg?: any;
    points: number;
}

type _PointEventT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    post_id: number | null;
    report_date: string;
    user_id: number | null;
    type: "post_summary";
    arg?: any;
    points: number;
}

export type GetPointEventOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $post?: boolean | undefined;
}

export type ListPointEventOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $post?: (boolean | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    date?: string | undefined;
}

export type PostSummaryPointEventFormT = {
    post_id: number;
    report_date: string;
    user_id: number | null;
    type: "post_summary";
    arg: {
        is_trashed: boolean;
        num_check: number;
        num_comment: number;
        num_vote: number;
        score: number;
    };
    points: number;
}


// @type-gen remain
import { PostT } from "./Post";

export interface PointEventT extends _PointEventT {
  post?: PostT
}