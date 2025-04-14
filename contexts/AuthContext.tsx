import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir el tipo de usuario
type User = {
    id: string;
    username: string;
    email: string;
};

// Definir la estructura del contexto de autenticación
type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<boolean>;
    signUp: (username: string, email: string, password: string) => Promise<boolean>;
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
                const userJSON = await AsyncStorage.getItem('user');
                if (userJSON) {
                    setUser(JSON.parse(userJSON));
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
    const signIn = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Aquí normalmente se haría una petición a un API real
            // En este ejemplo, simulamos una autenticación exitosa

            // Simulación de verificación (esto debe reemplazarse con tu lógica real)
            if (email && password) {
                // Usuario de prueba
                const mockUser: User = {
                    id: '1',
                    username: email.split('@')[0],
                    email,
                };

                setUser(mockUser);
                await AsyncStorage.setItem('user', JSON.stringify(mockUser));
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
    const signUp = async (username: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Aquí normalmente se haría una petición a un API real
            // En este ejemplo, simulamos un registro exitoso

            if (username && email && password) {
                // Crear un nuevo usuario
                const newUser: User = {
                    id: Date.now().toString(),
                    username,
                    email,
                };

                setUser(newUser);
                await AsyncStorage.setItem('user', JSON.stringify(newUser));
                return true;
            }
            return false;
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
            await AsyncStorage.removeItem('user');
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