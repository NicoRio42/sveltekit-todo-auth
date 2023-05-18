import { superValidate } from 'sveltekit-superforms/server';
import { TODO_DESCRIPTION_MAX_LENGTH, todoSchema } from '../../shema';
import { error, fail, redirect } from '@sveltejs/kit';
import { todos as todoDBSchema } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { todoPermissions } from '$lib/server/db/permissions';

export async function load({ locals, params, platform }) {
	const { user } = await locals.authRequest.validateUser();
	if (!user) throw redirect(302, '/login');

	const todo = locals.db
		.select()
		.from(todoDBSchema)
		.where(eq(todoDBSchema.id, params.todoId))
		.get();

	if (!todo) throw error(404, 'Not found');
	if (!todoPermissions.get(user, todo)) throw redirect(302, '/login');

	const form = await superValidate(
		{ description: todo.description, done: todo.done === 1 },
		todoSchema
	);

	return { form };
}

export const actions = {
	update: async ({ request, locals, params }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user) throw redirect(302, '/login');

		const form = await superValidate(request, todoSchema);
		if (!form.valid) return fail(400, { form });

		const todo = locals.db
			.select()
			.from(todoDBSchema)
			.where(eq(todoDBSchema.id, params.todoId))
			.get();
		if (!todo) throw error(404, 'Not found');
		if (!todoPermissions.update(user, todo)) throw redirect(302, '/login');

		locals.db
			.update(todoDBSchema)
			.set({
				description: form.data.description,
				done: form.data.done ? 1 : 0
			})
			.where(eq(todoDBSchema.id, todo.id))
			.run();

		throw redirect(302, '/');
	},
	updateDescription: async ({ request, locals, params }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user) throw redirect(302, '/login');

		const description = (await request.formData()).get('description');
		if (
			typeof description !== 'string' ||
			description.length === 0 ||
			description.length > TODO_DESCRIPTION_MAX_LENGTH
		)
			return fail(400);

		const todo = locals.db
			.select()
			.from(todoDBSchema)
			.where(eq(todoDBSchema.id, params.todoId))
			.get();
		if (!todo) throw error(404, 'Not found');
		if (!todoPermissions.update(user, todo)) throw redirect(302, '/login');

		locals.db.update(todoDBSchema).set({ description }).where(eq(todoDBSchema.id, todo.id)).run();

		throw redirect(302, '/');
	},
	toggleStatus: async ({ locals, params }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user) throw redirect(302, '/login');

		const todo = locals.db
			.select()
			.from(todoDBSchema)
			.where(eq(todoDBSchema.id, params.todoId))
			.get();
		if (!todo) throw error(404, 'Not found');
		if (!todoPermissions.update(user, todo)) throw redirect(302, '/login');

		locals.db
			.update(todoDBSchema)
			.set({
				done: todo.done === 0 ? 1 : 0
			})
			.where(eq(todoDBSchema.id, todo.id))
			.run();

		throw redirect(302, '/');
	},
	delete: async ({ locals, params }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user) throw redirect(302, '/login');

		const todo = locals.db
			.select()
			.from(todoDBSchema)
			.where(eq(todoDBSchema.id, params.todoId))
			.get();
		if (!todo) throw error(404, 'Not found');
		if (!todoPermissions.delete(user, todo)) throw redirect(302, '/login');

		locals.db.delete(todoDBSchema).where(eq(todoDBSchema.id, todo.id)).run();

		throw redirect(302, '/');
	}
};
