export type AccountSessionT = {
    account: {
        id: number;
        created_at: Date;
        updated_at?: Date | undefined;
        /** provided by firebase */
        sub: string;
        email: string;
        deleted_at?: (Date | null) | undefined;
    };
    accessToken: string;
    accessTokenExpAt: number;
}
