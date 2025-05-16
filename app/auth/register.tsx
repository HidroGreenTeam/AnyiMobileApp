import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { UserSignUpRequest, UserRole } from '../../auth/model/UserSignUpRequest';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        // Validación simple de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'El correo electrónico no es válido');
            return;
        }

        setIsLoading(true);
        try {
            const userSignUpRequest: UserSignUpRequest = {
                fullName,
                email,
                password,
                roles: [UserRole.ROLE_USER]
            };
            
            const success = await signUp(userSignUpRequest);
            if (success) {
                router.replace('/auth/login');
            } else {
                Alert.alert('Error', 'No se pudo crear la cuenta');
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
            Alert.alert('Error', 'Ocurrió un error al crear la cuenta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/ayni-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <ThemedText type="title">HidroGreen</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            placeholderTextColor="#7F8C8D"
                        />
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
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#7F8C8D"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={isLoading}>
                            <ThemedText style={styles.buttonText}>
                                {isLoading ? 'Cargando...' : 'Registrarse'}
                            </ThemedText>
                        </TouchableOpacity>

                        <ThemedView style={styles.loginContainer}>
                            <ThemedText>¿Ya tienes una cuenta? </ThemedText>
                            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                                <ThemedText type="link">Inicia sesión</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
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
        marginTop: 50,
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
});