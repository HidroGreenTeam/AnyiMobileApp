import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { UserSignInRequest } from '@/auth/model/UserSignInRequest';
import { UserSignUpRequest } from '@/auth/model/UserSignUpRequest';
import { User } from '@/auth/model/User';
import AuthService from '@/auth/services/auth-service';

// Definir la estructura del contexto de autenticación
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

    // Verificar si el usuario ya está autenticado al cargar la aplicación
    useEffect(() => {
        const loadUser = async () => {
            setIsLoading(true);
            try {
                const userData = await AuthService.getUserData();
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

    // Función para iniciar sesión
    const signIn = async (userSignInRequest: UserSignInRequest): Promise<boolean> => {
        setIsLoading(true);
        try {
            const userData = await AuthService.signIn(userSignInRequest);
            setUser(userData);
            return true;
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
            await AuthService.signUp(userSignUpRequest);
            return true;
        } catch (error) {
            console.error('Error al registrarse:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Función para cerrar sesión
    const signOut = async () => {
        setIsLoading(true);
        try {
            await AuthService.signOut();
            setUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
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