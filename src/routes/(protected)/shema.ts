import { z } from 'zod';

const TODO_DESCRIPTION_MAX_LENGTH = 100;

export const todoSchema = z.object({
	description: z
		.string()
		.nonempty('Description should not be empty')
		.max(
			TODO_DESCRIPTION_MAX_LENGTH,
			`Description should not exceed ${TODO_DESCRIPTION_MAX_LENGTH} characters.`
		),
	done: z.boolean()
});
