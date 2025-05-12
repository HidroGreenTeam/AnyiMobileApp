import { UserRole } from "./UserSignUpRequest";

export interface User {
    id: number;
    fullName: string;
    email: string;
    roles: UserRole[];
}

