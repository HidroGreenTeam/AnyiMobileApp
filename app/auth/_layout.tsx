import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
    return (
        <>
            <Stack initialRouteName="splash" screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white' },
                animation: 'slide_from_right'
            }}>
                <Stack.Screen name="splash" options={{ animation: 'none' }} />
                <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                <Stack.Screen name="login" />
                <Stack.Screen name="sign-up" />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}