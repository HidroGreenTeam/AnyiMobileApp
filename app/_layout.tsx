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

function RootLayoutNav({ segments }: { segments: string[] }) {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();  

  // After all hooks have been called, we can do conditional rendering
  if (!segments[0]) {
    return <Redirect href="/auth/splash" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLoading ? (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
  
  useEffect(() => {
    if (spaceMono && nunitoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [spaceMono, nunitoLoaded]);

  // Early return for loading fonts
  if (!spaceMono || !nunitoLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav segments={segments} />
    </AuthProvider>
  );
}
