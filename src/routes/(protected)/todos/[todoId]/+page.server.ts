import { superValidate } from 'sveltekit-superforms/server';
import { todoSchema } from '../../shema';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/db';
import { todos as todoDBSchema } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { todoPermissions } from '$lib/server/db/permissions';

export async function load({ locals, params }) {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

	const todo = db.select().from(todoDBSchema).where(eq(todoDBSchema.id, params.todoId)).get();

	if (!todo) throw error(404, 'Not found');
	if (!todoPermissions.get(user, todo)) throw redirect(302, '/login');

	const form = await superValidate(
		{ description: todo.description, done: todo.done === 1 },
		todoSchema
	);

	return { form };
}

export const actions = {
	default: async ({ request, locals, params }) => {
		const { user } = await locals.auth.validateUser();
		if (!user || !todoPermissions.create(user)) throw redirect(302, '/login');

		const form = await superValidate(request, todoSchema);
		if (!form.valid) return fail(400, { form });

		const todo = db.select().from(todoDBSchema).where(eq(todoDBSchema.id, params.todoId)).get();
		if (!todo) throw error(404, 'Not found');
		if (!todoPermissions.get(user, todo)) throw redirect(302, '/login');

		db.update(todoDBSchema)
			.set({
				description: form.data.description,
				done: form.data.done ? 1 : 0
			})
			.where(eq(todoDBSchema.id, todo.id))
			.run();

		throw redirect(302, '/');
	}
};
