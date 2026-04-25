import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

/**
 * Resolves the Better Auth base URL.
 *
 * In Expo Go we hit the Metro dev server (`<lan-ip>:8081`) which serves
 * our `app/api/auth/[...all]+api.ts` route handler. In production builds
 * point `EXPO_PUBLIC_AUTH_BASE_URL` at your real backend.
 */
function resolveBaseURL(): string {
    if (process.env.EXPO_PUBLIC_AUTH_BASE_URL) {
        return process.env.EXPO_PUBLIC_AUTH_BASE_URL;
    }

    const hostUri =
        Constants.expoConfig?.hostUri ??
        // @ts-expect-error - manifest is the legacy field, kept as a fallback
        Constants.manifest?.hostUri;

    if (hostUri) {
        const host = hostUri.split('/')[0];
        return `http://${host}`;
    }

    return 'http://localhost:8081';
}

export const authClient = createAuthClient({
    baseURL: resolveBaseURL(),
    plugins: [
        expoClient({
            scheme: 'mobleet',
            storagePrefix: 'mobleet',
            storage: SecureStore,
        }),
    ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
