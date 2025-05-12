import apiService from "@/shared/services/apiService";
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserSignInRequest } from "../model/UserSignInRequest";
import { UserRole, UserSignUpRequest } from "../model/UserSignUpRequest";
import { User } from "../model/User";

interface AuthResponse {
    token: string;
    user: User;
}

interface SignInResponse {
    id: number;
    email: string;
    token: string;
}

interface SignUpResponse {
    id: number;
    email: string;
    roles: string[];
}

export default class AuthService {
    static async signIn(userSignInRequest: UserSignInRequest): Promise<User> {
        const response = await apiService.post('/auth/sign-in', userSignInRequest) as unknown as SignInResponse;
        if (response && response.token) {
            await this.saveAuthToken(response.token);
            // convert response to User
            const user: User = {
                id: response.id,
                email: response.email,
                roles: [],
                fullName: ""
            }
            await this.saveUserData(user);
            return user;
        }
        throw new Error("Invalid credentials or missing token in response");
    }

    static async signUp(userSignUpRequest: UserSignUpRequest): Promise<User> {
        console.log("userSignUpRequest", userSignUpRequest);
        const response = await apiService.post('/auth/sign-up', userSignUpRequest) as unknown as SignUpResponse;
        console.log("response", response);
        // if is success, return user
        const user: User = {
            id: response.id,
            email: response.email,
            roles: response.roles.map(role => role as UserRole),
            fullName: ""
        }
        await this.saveUserData(user);
        return user;
    }

    static async signOut(): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        } else {
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('userData');
        }
    }

    static async saveAuthToken(token: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem('authToken', token);
        } else {
            await SecureStore.setItemAsync('authToken', token);
        }
    }

    static async saveUserData(user: User): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem('userData', JSON.stringify(user));
        } else {
            await SecureStore.setItemAsync('userData', JSON.stringify(user));
        }
    }

    static async getAuthToken(): Promise<string | null> {
        if (Platform.OS === 'web') {
            return localStorage.getItem('authToken');
        } else {
            return await SecureStore.getItemAsync('authToken');
        }
    }

    static async getUserData(): Promise<User | null> {
        if (Platform.OS === 'web') {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } else {
            const userData = await SecureStore.getItemAsync('userData');
            return userData ? JSON.parse(userData) : null;
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        const token = await this.getAuthToken();
        return !!token;
    }
}
