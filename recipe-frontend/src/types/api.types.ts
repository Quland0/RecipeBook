export type StrapiListResponse<T> = {
    data: T[];
    meta: unknown;
};

export type StrapiResponse<T> = {
    data: T;
    meta?: unknown;
};