export type PointReportFormT = {
    report_date: string;
    user_id: number | null;
    total_points: number;
    is_checked?: boolean | undefined;
    is_applied?: boolean | undefined;
}

export type PointReportT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    report_date: string;
    user_id: number | null;
    total_points: number;
    is_checked?: boolean | undefined;
    is_applied?: boolean | undefined;
}

export type GetPointReportOptionT = {
    userId?: (number | undefined) | undefined;
    groupId?: (number | undefined) | undefined;
}

export type ListPointReportOptionT = {
    userId?: ((number | undefined) | undefined) | undefined;
    groupId?: ((number | undefined) | undefined) | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    fromDate?: string | undefined;
    untilDate?: string | undefined;
}
