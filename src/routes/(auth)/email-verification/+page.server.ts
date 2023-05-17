import { sendEmailVerificationEmail } from '$lib/server/email.js';
import { auth, emailVerificationToken } from '$lib/server/lucia.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(301, '/login');
	if (user.emailVerified) throw redirect(301, '/');

	return { sent: false };
}

export const actions = {
	default: async ({ locals }) => {
		const { user } = await locals.auth.validateUser();
		if (!user) throw redirect(301, '/login');
		if (user.emailVerified) throw redirect(301, '/');

		await emailVerificationToken.invalidateAllUserTokens(user.id);
		const token = await emailVerificationToken.issue(user.id);
		sendEmailVerificationEmail(user.email, token.toString());

		return { sent: true };
	}
};
