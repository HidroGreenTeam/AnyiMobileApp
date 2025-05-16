import { createContext, useContext, useState, useEffect } from 'react';
import { UserSignInRequest } from '@/auth/model/UserSignInRequest';
import { UserSignUpRequest } from '@/auth/model/UserSignUpRequest';
import { User } from '@/auth/model/User';
import AuthService from '@/auth/services/auth-service';
import { router } from 'expo-router';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (userSignInRequest: UserSignInRequest) => Promise<boolean>;
    signUp: (userSignUpRequest: UserSignUpRequest) => Promise<boolean>;
    signOut: () => Promise<void>;
};

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const authService = new AuthService();

    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const userData = await authService.getUserData();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);
    const signIn = async (userSignInRequest: UserSignInRequest): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await authService.signIn(userSignInRequest);
            if (response) {
                setUser(response);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para registrarse
    const signUp = async (userSignUpRequest: UserSignUpRequest): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Only register the user but don't set as the current logged in user
            await authService.signUp(userSignUpRequest);
            return true;
        } catch (error) {
            console.error('Error al registrarse:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };    // Función para cerrar sesión
    const signOut = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await authService.signOut();
            setUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw new Error('Error al cerrar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}