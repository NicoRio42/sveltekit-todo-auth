const EMAIL_VERIFICATION_URL = 'http://localhost:5173/email-verification';
const PASSWORD_RESET_URL = 'http://localhost:5173/reset-password';

export function sendEmailVerificationEmail(email: string, token: string) {
	console.log('Email verification url for ', email, `${EMAIL_VERIFICATION_URL}/${token}`);
}

export function sendPasswordResetEmail(email: string, token: string) {
	console.log('Password reset url for ', email, `${PASSWORD_RESET_URL}/${token}`);
}
