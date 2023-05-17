<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { loginFormSchema } from './schema';

	export let data;

	const { form, delayed, enhance, tainted, errors } = superForm(data.form, {
		validators: loginFormSchema,
		taintedMessage: null
	});
</script>

<form method="POST" use:enhance novalidate>
	<h1>Login</h1>

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

	<button type="submit" aria-busy={$delayed}>Login</button>

	<p><a href="/reset-password">Reset password</a></p>

	{#each $errors._errors ?? [] as globalError}
		<p>
			<small class="error">{globalError}</small>
		</p>
	{/each}
</form>
