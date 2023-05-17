import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import sqlite from 'better-sqlite3';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { dev } from '$app/environment';
import { idToken } from '@lucia-auth/tokens';

const database = sqlite('sqlite.db');

export const auth = lucia({
	// @ts-ignore
	adapter: betterSqlite3(database),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => ({
		id: userData.id,
		name: userData.name,
		email: userData.email,
		emailVerified: userData.email_verified,
		role: userData.role
	})
});

export type Auth = typeof auth;

export const emailVerificationToken = idToken(auth, 'email_verification', {
	expiresIn: 60 * 60
});

export const passwordResetToken = idToken(auth, 'password-reset', {
	expiresIn: 60 * 60
});
