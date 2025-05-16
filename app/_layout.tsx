import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Component, useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import 'react-native-reanimated';
import {
  useFonts as useNunito,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { ThemedView } from '@/components/ThemedView';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleColors } from '@/constants';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const currentRoute = segments.join('/');
    
    // Allow splash and onboarding screens to be displayed without redirection
    const isSpecialAuthRoute = 
      currentRoute === 'auth/splash' || 
      currentRoute === 'auth/onboarding';

    if (!user && !inAuthGroup) {
      router.replace('/auth/splash'); // Navigate to splash screen instead of login directly
    } else if (user && inAuthGroup && !isSpecialAuthRoute) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLoading ? (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: StyleColors.brand.primary }}>Cargando...</Text>
          <ActivityIndicator size="large" color={StyleColors.brand.primary} />
        </ThemedView>
      ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [spaceMono] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const [nunitoLoaded] = useNunito({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });
  
  // Redirect to the splash screen as initial route
  const segments = useSegments();
  if (segments.length === 0) {
    return <Redirect href="/auth/splash" />;
  }

  useEffect(() => {
    if (spaceMono && nunitoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [spaceMono, nunitoLoaded]);

  if (!spaceMono || !nunitoLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
