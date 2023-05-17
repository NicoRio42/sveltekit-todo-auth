import { auth } from '$lib/server/lucia.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

	return {
		user
	};
}

export const actions = {
	default: async ({ locals }) => {
		const user = await locals.auth.validateUser();
		if (!user) return fail(401);
		await auth.deleteUser(user.session?.userId ?? '');
		redirect(302, '/login');
	}
};
