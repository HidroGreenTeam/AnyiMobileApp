import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { UserSignUpRequest, UserRole } from '@/auth/model/UserSignUpRequest';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

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
            const userSignUpRequest = {
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
            <StatusBar style="dark" backgroundColor="white" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                

                {/* Back button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>
                        {'<'}
                    </Text>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Join Ayni Today</Text>
                        <Text style={styles.headerSubtitle}>Create Your Blooming Account</Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('@/assets/images/ayni-logo.png')}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>                    {/* Full Name Input (mantenido del código original) */}
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="person-outline" size={24} color="#7F8C8D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            placeholderTextColor="#7F8C8D"
                        />
                    </View>                    {/* Email Input */}
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="mail-outline" size={24} color="#7F8C8D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#7F8C8D"
                        />
                    </View>                    {/* Password Input */}
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="lock-closed-outline" size={24} color="#7F8C8D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#7F8C8D"
                        />
                        <TouchableOpacity style={styles.eyeIcon}>
                            <Ionicons name="eye-outline" size={24} color="#7F8C8D" />
                        </TouchableOpacity>
                    </View>                    {/* Confirm Password Input (mantenido del código original) */}
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIcon}>
                            <Ionicons name="lock-closed-outline" size={24} color="#7F8C8D" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#7F8C8D"
                        />
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                            <Text style={styles.loginLink}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider}></View>
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider}></View>
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={handleRegister}
                        disabled={isLoading}>
                        <Text style={styles.signUpButtonText}>
                            {isLoading ? 'Cargando...' : 'Sign up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    time: {
        fontWeight: 'bold',
    },
    statusIcons: {
        flexDirection: 'row',
    },
    backButton: {
        marginTop: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: 40,
        height: 40,
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7F8',
        borderRadius: 8,
        marginBottom: 20,
        height: 50,
    },
    inputIcon: {
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        paddingHorizontal: 12,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: '#00a67d',
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        paddingHorizontal: 10,
        color: '#888',
    },
    socialButtonsContainer: {
        gap: 16,
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 50,
        padding: 14,
    },
    googleIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    appleIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    facebookIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1877F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    socialButtonIcon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    socialButtonText: {
        fontSize: 16,
        color: '#333',
    },
    signUpButton: {
        backgroundColor: '#00a67d',
        borderRadius: 50,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});