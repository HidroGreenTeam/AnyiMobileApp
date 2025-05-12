export interface UserSignUpRequest {
    fullName: string;
    email: string;
    password: string;
    roles: UserRole[];
}


export enum UserRole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
}
