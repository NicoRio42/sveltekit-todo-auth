<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { resetPasswordEmailSchema } from './schema.js';

	export let data;

	const { form, errors, delayed, tainted, enhance, message } = superForm(data.form, {
		validators: resetPasswordEmailSchema
	});
</script>

<form method="post" use:enhance>
	<h1>Reset password</h1>

	<label>
		Email
		<input
			name="email"
			type="email"
			bind:value={$form.email}
			data-invalid={$errors.email}
			aria-invalid={$tainted?.email && $errors.email !== undefined && $errors.email.length !== 0}
		/>

		{#each $errors.email ?? [] as emailError}
			<small class="error">{emailError}</small>
		{/each}
	</label>

	<button type="submit" aria-busy={$delayed}>Send email</button>

	{#if $message}
		<p>{$message}</p>
	{/if}
</form>
