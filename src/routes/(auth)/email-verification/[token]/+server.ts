import { error, fail, redirect } from '@sveltejs/kit';
import { auth, emailVerificationToken } from '$lib/server/lucia';
import { LuciaTokenError } from '@lucia-auth/tokens';

export const GET = async ({ params, locals }) => {
	const tokenParams = params.token;

	try {
		const token = await emailVerificationToken.validate(tokenParams);
		await auth.invalidateAllUserSessions(token.userId);

		await auth.updateUserAttributes(token.userId, {
			email_verified: 1
		});

		const session = await auth.createSession(token.userId);
		locals.auth.setSession(session);
	} catch (e) {
		if (e instanceof LuciaTokenError && e.message === 'EXPIRED_TOKEN') {
			throw error(401, 'Expired token');
		}
		if (e instanceof LuciaTokenError && e.message === 'INVALID_TOKEN') {
			throw error(401, 'Invalid token');
		}

		throw error(500);
	}

	throw redirect(302, '/');
};
