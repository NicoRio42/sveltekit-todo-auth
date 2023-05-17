import { RolesEnum } from '$lib/models/enums/roles.enum';
import { db } from '$lib/server/db/db';
import { user as userDBShema } from '$lib/server/db/schema';
import { sendEmailVerificationEmail } from '$lib/server/email';
import { auth, emailVerificationToken } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { signUpFormSchema } from './schema';

export async function load() {
	const form = await superValidate(signUpFormSchema);
	return { form };
}

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, signUpFormSchema);

		if (!form.valid) {
			return setError(form, null, 'An error occured');
		}

		const existingUser = db
			.select()
			.from(userDBShema)
			.where(eq(userDBShema.name, form.data.name))
			.all();

		if (existingUser.length !== 0) {
			return setError(form, 'name', 'Name allready exists');
		}

		const existingEmail = db
			.select()
			.from(userDBShema)
			.where(eq(userDBShema.email, form.data.email))
			.all();

		if (existingEmail.length !== 0) {
			return setError(form, 'email', 'Email allready linked to an account');
		}

		const user = await auth.createUser({
			primaryKey: {
				providerId: 'username',
				providerUserId: form.data.name,
				password: form.data.password
			},
			attributes: {
				name: form.data.name,
				email: form.data.email,
				role: RolesEnum.Enum.default,
				email_verified: 0
			}
		});

		const session = await auth.createSession(user.id);
		locals.auth.setSession(session);

		const token = await emailVerificationToken.issue(user.id);
		await sendEmailVerificationEmail(user.email, token.toString());

		throw redirect(302, '/');
	}
};
