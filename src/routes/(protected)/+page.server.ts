import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { todoSchema } from './shema.js';
import { todoPermissions } from '$lib/server/db/permissions.js';
import { todos as todoDBSchema } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	const { user } = await locals.authRequest.validateUser();
	if (!user) throw redirect(302, '/login');

	const todos = await locals.db
		.select()
		.from(todoDBSchema)
		.where(eq(todoDBSchema.userId, user.id))
		.all();

	const form = await superValidate(todoSchema);

	return {
		user,
		form,
		todos
	};
}

export const actions = {
	default: async ({ request, locals }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user || !todoPermissions.create(user)) throw redirect(302, '/login');

		const form = await superValidate(request, todoSchema);
		if (!form.valid) return fail(400, { form });

		await locals.db
			.insert(todoDBSchema)
			.values({
				id: crypto.randomUUID(),
				userId: user.id,
				description: form.data.description,
				done: form.data.done ? 1 : 0
			})
			.run();

		throw redirect(302, '/');
	}
};
