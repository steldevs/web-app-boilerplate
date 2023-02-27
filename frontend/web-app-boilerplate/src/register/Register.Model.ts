import { Role } from "../state/types";

export interface RegisterModel {
    username: string;
    email: string;
    accountType: Role;
    password: string;
    passwordConfirmation: string;
}