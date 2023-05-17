import { db } from '$lib/server/db/db.js';
import { user as userDBSchema } from '$lib/server/db/schema.js';
import { RolesEnum } from '$lib/models/enums/roles.enum.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const { user } = await locals.auth.validateUser();
	if (!user || user.role !== RolesEnum.Enum.admin) throw redirect(302, '/');

	const users = db.select().from(userDBSchema).all();

	return {
		user,
		users
	};
}
