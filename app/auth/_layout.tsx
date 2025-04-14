import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
    return (
        <>
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white' }
            }} />
            <StatusBar style="auto" />
        </>
    );
}