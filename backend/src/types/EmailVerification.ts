export type EmailVerificationFormT = {
    email: string;
    is_verified: boolean;
    code: string;
    trial: number;
}

export type EmailVerificationT = {
    id: number;
    created_at: Date;
    updated_at?: Date | undefined;
    email: string;
    is_verified: boolean;
    code: string;
    trial: number;
}
