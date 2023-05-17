import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm';
import { RolesEnum } from '../../models/enums/roles.enum';

export const user = sqliteTable('auth_user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	emailVerified: integer('email_verified').default(0).notNull(),
	role: text('role', { enum: [RolesEnum.Enum.admin, RolesEnum.Enum.default] })
		.default('default')
		.notNull()
});

export type User = InferModel<typeof user>;
export type InsertUser = InferModel<typeof user, 'insert'>;

export const session = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: integer('active_expires').notNull(),
	idleExpires: integer('idle_expires').notNull()
});

export const key = sqliteTable('auth_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	primaryKey: integer('primary_key').notNull(),
	hashedPassword: text('hashed_password'),
	expires: integer('expires')
});

export const todos = sqliteTable('todos', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	description: text('description').notNull(),
	done: integer('done').default(0)
});

export type Todo = InferModel<typeof todos>;
export type InsertTodo = InferModel<typeof todos, 'insert'>;
