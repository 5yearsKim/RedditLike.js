export type BoardFormT = {
    group_id: number;
    name: string;
    description: string;
    avatar_path?: (string | null) | undefined;
    bg_path?: (string | null) | undefined;
    theme_color?: (string | null) | undefined;
    default_nickname?: (string | null) | undefined;
    default_avatar_path?: (string | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    hot_score?: number | undefined;
    num_follower?: number | undefined;
    num_post?: number | undefined;
    use_theme?: boolean | undefined;
    use_spoiler?: boolean | undefined;
    use_nsfw?: boolean | undefined;
    use_flag?: boolean | undefined;
    force_flag?: boolean | undefined;
    allow_multiple_flag?: boolean | undefined;
    use_flair?: boolean | undefined;
    force_flair?: boolean | undefined;
    allow_post_manager_only?: boolean | undefined;
    use_public_chat?: boolean | undefined;
    use_email_only?: boolean | undefined;
}

type _BoardT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    group_id: number;
    name: string;
    description: string;
    avatar_path?: (string | null) | undefined;
    bg_path?: (string | null) | undefined;
    theme_color?: (string | null) | undefined;
    default_nickname?: (string | null) | undefined;
    default_avatar_path?: (string | null) | undefined;
    trashed_at?: (Date | null) | undefined;
    trashed_by?: (("manager" | "admin") | null) | undefined;
    hot_score: number;
    num_follower: number;
    num_post: number;
    use_theme: boolean;
    use_spoiler: boolean;
    use_nsfw: boolean;
    use_flag: boolean;
    force_flag: boolean;
    allow_multiple_flag: boolean;
    use_flair: boolean;
    force_flair: boolean;
    allow_post_manager_only: boolean;
    use_public_chat: boolean;
    use_email_only: boolean;
}

export type GetBoardOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
    $user_defaults?: boolean | undefined;
    $posts?: ("recent") | undefined;
}

export type ListBoardOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    $user_defaults?: (boolean | undefined) | undefined;
    $posts?: (("recent") | undefined) | undefined;
    sort?: ("hot" | "recent" | "old" | "follower" | "recently_followed") | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    following?: ("only" | "except") | undefined;
    managing?: ("only" | "except") | undefined;
    block?: ("only" | "except") | undefined;
    censor?: ("approved" | "trashed" | "exceptTrashed" | "exceptProcessed") | undefined;
    search?: string | undefined;
    categoryId?: ((number | "except") | number[]) | undefined;
}

export type BoardSortT = "hot" | "recent" | "old" | "follower" | "recently_followed"


// @type-gen remain
import type { PostT } from "./Post";
import type { BoardFollowerT } from "./BoardFollower";
import type { BoardMuterT } from "./BoardMuter";
import type { BoardBlockT } from "./BoardBlock";

export interface BoardT extends _BoardT {
  posts?: PostT[];
  follower?: BoardFollowerT|null;
  block?: BoardBlockT;
  muter?: BoardMuterT;
}