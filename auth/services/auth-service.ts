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
    async signIn(userSignInRequest: UserSignInRequest): Promise<User> {
        const response = await apiService.post('/auth/sign-in', userSignInRequest) as unknown as SignInResponse;
        console.log("AuthService.signIn response:", response);  
        if (response && response.token) {
            await this.saveAuthToken(response.token);
            console.log("AuthService.signIn token:", response.token);
            // convert response to User
            const user: User = {
                id: response.id,
                email: response.email,
                roles: [],
            }
            await this.saveUserData(user);
            console.log("AuthService.signIn user:", user);
            return user;
        }
        throw new Error("Invalid credentials or missing token in response");
    }

    async signUp(userSignUpRequest: UserSignUpRequest): Promise<User> {
        console.log("userSignUpRequest", userSignUpRequest);
        const response = await apiService.post('/auth/sign-up', userSignUpRequest) as unknown as SignUpResponse;
        console.log("response", response);
        // if is success, return user
        const user: User = {
            id: response.id,
            email: response.email,
            roles: response.roles.map(role => role as UserRole),
        }
        await this.saveUserData(user);
        return user;
    }

    async signOut(): Promise<void> {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            } else {
                await SecureStore.deleteItemAsync('authToken');
                await SecureStore.deleteItemAsync('userData');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw new Error('Error al cerrar sesión');

        }
    }

    async saveAuthToken(token: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem('authToken', token);
        } else {
            await SecureStore.setItemAsync('authToken', token);
        }
    }

    async saveUserData(user: User): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem('userData', JSON.stringify(user));
        } else {
            await SecureStore.setItemAsync('userData', JSON.stringify(user));
        }
    }

    async getAuthToken(): Promise<string | null> {
        if (Platform.OS === 'web') {
            return localStorage.getItem('authToken');
        } else {
            return await SecureStore.getItemAsync('authToken');
        }
    }

    async getUserData(): Promise<User | null> {
        if (Platform.OS === 'web') {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } else {
            const userData = await SecureStore.getItemAsync('userData');
            return userData ? JSON.parse(userData) : null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getAuthToken();
        return !!token;
    }
}
