import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider, Spinner } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/lib/auth-client';
import '../global.css';

function AuthGate({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = useSession();
	const segments = useSegments() as string[];

	const onAuthStack = segments[0] === '(auth)';
	const onApiRoute = segments[0] === 'api';

	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner />
			</View>
		);
	}

	if (!session && !onAuthStack && !onApiRoute) {
		return <Redirect href={'/sign-in' as never} />;
	}

	if (session && onAuthStack) {
		return <Redirect href={'/' as never} />;
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
							<Stack.Screen
								name="(auth)"
								options={{ animation: 'fade' }}
							/>
							<Stack.Screen
								name="(tabs)"
								options={{ animation: 'fade' }}
							/>
						</Stack>
					</AuthGate>
				</HeroUINativeProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
