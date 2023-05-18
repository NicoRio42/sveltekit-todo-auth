import { dev } from '$app/environment';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

let db: BetterSQLite3Database | undefined;
let database;

export function getDB(platform: App.Platform | undefined) {
	if (db !== undefined) return db;
	if (dev) return drizzle(new Database('sqlite.db'));
	if (platform === undefined) throw new Error('platform is undefined');
	if (platform.env === undefined) throw new Error('platform.env is undefined');
	return drizzle(platform.env.DB);
}
