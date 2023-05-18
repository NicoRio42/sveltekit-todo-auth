import { dev } from '$app/environment';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { idToken } from '@lucia-auth/tokens';
import type { Handle } from '@sveltejs/kit';
import type { Database } from 'better-sqlite3';
import sqlite3 from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';

export const handle: Handle = async ({ event, resolve }) => {
	const db = getBetterSQLite3Database(event.platform);
	event.locals.db = getDrizzleInstance(db);

	const auth = getAuth(db);
	event.locals.auth = auth;
	event.locals.authRequest = auth.handleRequest(event);

	event.locals.emailVerificationToken = getEmailVerificationToken(auth);
	event.locals.passwordResetToken = getPasswordResetToken(auth);
	return await resolve(event);
};

let sqlite3Database: Database | undefined;

function getBetterSQLite3Database(platform: App.Platform | undefined): Database {
	if (sqlite3Database !== undefined) return sqlite3Database;
	if (dev) return new sqlite3('sqlite.db');
	if (platform === undefined) throw new Error('platform is undefined');
	if (platform.env === undefined) throw new Error('platform.env is undefined');
	return platform.env.TODO_LIST_DB;
}

let drizzleInstance: BetterSQLite3Database;

function getDrizzleInstance(db: Database) {
	if (drizzleInstance !== undefined) return drizzleInstance;

	return drizzle(db);
}

export type Auth = ReturnType<typeof createNewAuth>;
let auth: Auth;

function createNewAuth(db: Database) {
	const auth = lucia({
		// @ts-ignore
		adapter: betterSqlite3(db),
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

	return auth;
}

function getAuth(db: Database) {
	if (auth !== undefined) return auth;

	return createNewAuth(db);
}

export type EmailVerificationToken = ReturnType<typeof createNewEmailVerificationToken>;
let emailVerificationToken: EmailVerificationToken;

function createNewEmailVerificationToken(auth: Auth) {
	return idToken(auth, 'email_verification', {
		expiresIn: 60 * 60
	});
}

function getEmailVerificationToken(auth: Auth) {
	if (emailVerificationToken !== undefined) return emailVerificationToken;

	return createNewEmailVerificationToken(auth);
}

export type PasswordResetToken = ReturnType<typeof createNewPasswordResetToken>;
let passwordResetToken: PasswordResetToken;

function createNewPasswordResetToken(auth: Auth) {
	return idToken(auth, 'password-reset', {
		expiresIn: 60 * 60
	});
}

function getPasswordResetToken(auth: Auth) {
	if (passwordResetToken !== undefined) return passwordResetToken;

	return createNewPasswordResetToken(auth);
}
