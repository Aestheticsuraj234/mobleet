import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { DatabaseSync } from 'node:sqlite';

/**
 * Better Auth server instance.
 *
 * Runs inside Expo Router API routes (server-only). Uses a local SQLite
 * file in dev — replace with a hosted DB (Postgres/MySQL) before shipping.
 *
 * Required env vars (in .env at project root):
 *   BETTER_AUTH_SECRET            - 32+ char random string
 *   GITHUB_CLIENT_ID              - GitHub OAuth app client id
 *   GITHUB_CLIENT_SECRET          - GitHub OAuth app client secret
 */
export const auth = betterAuth({
    database: new DatabaseSync('./auth.db'),
    secret: process.env.BETTER_AUTH_SECRET ?? 'dev-only-please-set-BETTER_AUTH_SECRET',
    plugins: [expo()],
    trustedOrigins: [
        'mobleet://',
        'mobleet://*',
        // Expo Go in dev — IPs vary, allow the typical LAN ranges
        'exp://',
        'exp://**',
        'exp://192.168.*.*:*/**',
        'exp://10.*.*.*:*/**',
        'exp://172.*.*.*:*/**',
    ],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        },
    },
});
