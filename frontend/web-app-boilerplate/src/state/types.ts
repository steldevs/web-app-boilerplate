export interface Root {
    user: User | null
}

export interface LoginAction {
    user: User;
}

export interface User {
    id: string,
    username: string,
    email: string,
    role: Role
}

export type Role = "admin" | "user";