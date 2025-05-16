import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image, View, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { UserSignInRequest } from '../../auth/model/UserSignInRequest';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');    
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, isLoading } = useAuth();
    
    const handleLoginSuccess = () => {
        console.log('Login successful: Navigating to tabs');
        router.replace('/(tabs)');
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        const userSignInRequest: UserSignInRequest = {
            email,
            password
        };
        const success = await signIn(userSignInRequest);
        console.log('Login success:', success);
        if (success) {
            handleLoginSuccess();
        } else {
            Alert.alert('Error', 'Credenciales inválidas');
        }
    };

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = () => {
        // Use an Alert instead of direct navigation to avoid the Root Layout error
        Alert.alert(
            "Feature Coming Soon",
            "Password recovery will be available in the next update.",
            [{ text: "OK" }]
        );
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ThemedView style={styles.container}>                
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <ThemedView style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome Back! 👋</Text>

                    <Text style={styles.subtitleText}>Let's Continue Your Green Journey</Text>
                </ThemedView>

                <ThemedView style={styles.formContainer}>
                    <ThemedText style={styles.inputLabel}>Email</ThemedText>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#7F8C8D"
                        />
                    </View>

                    <ThemedText style={styles.inputLabel}>Password</ThemedText>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#7F8C8D"
                        />
                        <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordToggle}>
                            <Ionicons 
                                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color="#7F8C8D" 
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity style={styles.checkboxRow} onPress={toggleRememberMe}>
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </View>
                            <ThemedText style={styles.checkboxText}>Remember me</ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={isLoading}>
                        <ThemedText style={styles.loginButtonText}>
                            {isLoading ? 'Cargando...' : 'Log in'}
                        </ThemedText>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <ThemedText style={styles.dividerText}>or</ThemedText>
                        <View style={styles.dividerLine} />
                    </View>

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText style={styles.registerText}>¿No tienes una cuenta? </ThemedText>
                        <Link href="/auth/sign-up">
                            <ThemedText type="link">Regístrate</ThemedText>
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
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2C3E50',
    },
    subtitleText: {
        fontSize: 18,
        color: '#7F8C8D',
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#2C3E50',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7F8',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
    },
    passwordToggle: {
        padding: 10,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#0A9B70',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#0A9B70',
    },
    checkboxText: {
        fontSize: 14,
        color: '#0A9B70',
    },
    forgotPassword: {
        color: '#0A9B70',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#0A9B70',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#DDDDDD',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#7F8C8D',
    },
    
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'transparent',
    },
    registerText: {
        color: '#7F8C8D',
        fontSize: 14,
        marginRight: 4,
    },
});