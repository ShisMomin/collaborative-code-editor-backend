import { db } from '@/db';
import * as authSchema from '@/db/schema/auth-schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL!,
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: authSchema,
    }),
    trustedOrigins: ['http://localhost:3000'],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: {
        github: {
            prompt: 'select_account',
            clientId: process.env.AUTH_GITHUB_ID as string,
            clientSecret: process.env.AUTH_GITHUB_SECRET as string,
        },
        google: {
            prompt: 'select_account',
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // refresh every 1 day
    },
    development: process.env.NODE_ENV !== 'production',
    advanced: {
        cookiePrefix: 'auth',
        useSecureCookies: true,
    },
});
