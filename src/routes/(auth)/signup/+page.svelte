<script>
	import { superForm } from 'sveltekit-superforms/client';
	import { signUpFormSchema } from './schema';

	export let data;

	const { form, errors, delayed, tainted, enhance } = superForm(data.form, {
		validators: signUpFormSchema,
		taintedMessage: null
	});
</script>

<form method="POST" use:enhance novalidate>
	<h1>Create an account</h1>

	<label>
		Name
		<input
			name="name"
			bind:value={$form.name}
			data-invalid={$errors.name}
			aria-invalid={$tainted?.name && $errors.name !== undefined && $errors.name.length !== 0}
		/>

		{#each $errors.name ?? [] as nameError}
			<small class="error">{nameError}</small>
		{/each}
	</label>

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

	<label>
		Password
		<input
			type="password"
			name="password"
			bind:value={$form.password}
			data-invalid={$errors.password}
			aria-invalid={$tainted?.password &&
				$errors.password !== undefined &&
				$errors.password.length !== 0}
		/>

		{#each $errors.password ?? [] as passwordError}
			<small class="error">{passwordError}</small>
		{/each}
	</label>

	<label>
		Confirm password
		<input
			type="password"
			name="passwordConfirmation"
			bind:value={$form.passwordConfirmation}
			data-invalid={$errors.passwordConfirmation}
			aria-invalid={$tainted?.passwordConfirmation &&
				$errors.passwordConfirmation !== undefined &&
				$errors.passwordConfirmation.length !== 0}
		/>

		{#each $errors.passwordConfirmation ?? [] as passwordConfirmationError}
			<small class="error">{passwordConfirmationError}</small>
		{/each}
	</label>

	<button type="submit" aria-busy={$delayed}>Sign up</button>
</form>
