import React from 'react';
import { View } from 'react-native';
import { Stack, Redirect, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider, Spinner } from 'heroui-native';

import { useSession } from '@/lib/auth-client';
import '../global.css';

function AuthGate({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();
    const segments = useSegments() as string[];

    const onSignIn = segments[0] === 'sign-in';
    const onApiRoute = segments[0] === 'api';

    if (isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Spinner />
            </View>
        );
    }

    if (!session && !onSignIn && !onApiRoute) {
        return <Redirect href={'/sign-in' as never} />;
    }

    if (session && onSignIn) {
        return <Redirect href="/" />;
    }

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <HeroUINativeProvider>
                    <StatusBar style="light" />
                    <AuthGate>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: '#0a0a0c' },
                                animation: 'fade',
                            }}
                        >
                            <Stack.Screen name="index" />
                            <Stack.Screen
                                name="sign-in"
                                options={{ animation: 'fade' }}
                            />
                        </Stack>
                    </AuthGate>
                </HeroUINativeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
