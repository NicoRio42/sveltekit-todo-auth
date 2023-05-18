import { RolesEnum } from '$lib/models/enums/roles.enum.js';
import { getAuth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	delete: async ({ locals, params }) => {
		const { user } = await locals.authRequest.validateUser();
		if (!user) throw redirect(302, '/login');
		if (user.emailVerified === 0) throw redirect(302, '/email-verification');

		if (user.role === RolesEnum.Enum.admin || user.id === params.userId) {
			const auth = getAuth(locals.db);
			await auth.deleteUser(params.userId);
			throw redirect(302, '/users');
		}

		throw redirect(302, '/');
	}
};