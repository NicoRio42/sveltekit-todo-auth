// See https://kit.svelte.dev/docs/types#app

import type { User as UserFromDB } from '$lib/server/db/schema';
import type { RolesEnum } from '$lib/models/enums/roles.enum.ts';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
		}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type UserAttributes = {
			name: string;
			email: string;
			email_verified: number;
			role: RolesEnum;
		};
	}
}

export {};
