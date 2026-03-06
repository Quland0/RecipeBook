export type AuthUser = {
    id: number;
    username: string;
    email: string;
};

export type AuthResponse = {
    jwt: string;
    user: AuthUser;
};

export type LoginPayload = {
    identifier: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};