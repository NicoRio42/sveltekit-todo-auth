import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import database from 'better-sqlite3';

const sqlite = database('sqlite.db');
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: './migrations' });
