export type PointDailyQuotaFormT = {
    report_date: string;
    point_quota: number;
    check_point: number;
    comment_point: number;
    score_point: number;
    trash_point: number;
}

export type PointDailyQuotaT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    report_date: string;
    point_quota: number;
    check_point: number;
    comment_point: number;
    score_point: number;
    trash_point: number;
}

export type GetPointDailyQuotaOptionT = {
    userId?: (number | undefined) | undefined;
}

export type ListPointDailyQuotaOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
}
