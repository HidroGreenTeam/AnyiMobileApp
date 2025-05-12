import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { UserSignInRequest } from '../../auth/model/UserSignInRequest';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setIsLoading(true);
        try {
            const userSignInRequest: UserSignInRequest = {
                email,
                password
            };
            
            const success = await signIn(userSignInRequest);
            if (success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <ThemedText type="title">HidroGreen</ThemedText>
                </ThemedView>

                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#7F8C8D"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#7F8C8D"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={isLoading}>
                        <ThemedText style={styles.buttonText}>
                            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                        </ThemedText>
                    </TouchableOpacity>

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText>¿No tienes una cuenta? </ThemedText>
                        <Link href="/auth/register" asChild>
                            <TouchableOpacity>
                                <ThemedText type="link">Regístrate</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 50,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    inputContainer: {
        width: '100%',
        gap: 16,
    },
    input: {
        backgroundColor: '#F5F7F8',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0a7ea4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});