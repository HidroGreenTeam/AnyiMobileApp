import { UserRole } from "./UserSignUpRequest";

export interface User {
    id: number;
    email: string;
    roles: UserRole[];
}

