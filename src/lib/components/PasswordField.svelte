<script lang="ts">
	import EyeSlash from './icons/EyeSlash.svelte';

	import Eye from './icons/Eye.svelte';

	import type { UnwrapEffects } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { z, AnyZodObject } from 'zod';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T>;
	export let label: string | undefined = undefined;

	let showPassword = false;
	let errorsHaveBeenshownOnce = false;

	const { value, errors } = formFieldProxy(form, field);

	errors.subscribe((errs) => {
		if (!errorsHaveBeenshownOnce) errorsHaveBeenshownOnce = errs !== undefined && errs.length !== 0;
	});
</script>

<label>
	{#if label !== undefined}
		{label}
	{/if}

	<div
		class="input-wrapper"
		data-invalid={errorsHaveBeenshownOnce ? $errors !== undefined && $errors.length !== 0 : null}
	>
		{#if showPassword}
			<input
				name={String(field)}
				type="text"
				bind:value={$value}
				data-invalid={$errors}
				aria-invalid={errorsHaveBeenshownOnce
					? $errors !== undefined && $errors.length !== 0
					: null}
				{...$$restProps}
			/>
		{:else}
			<input
				name={String(field)}
				type="password"
				bind:value={$value}
				data-invalid={$errors}
				aria-invalid={errorsHaveBeenshownOnce
					? $errors !== undefined && $errors.length !== 0
					: null}
				{...$$restProps}
			/>
		{/if}

		<button
			type="button"
			class="btn-unset show-password-button"
			on:click={() => (showPassword = !showPassword)}
		>
			{#if showPassword}
				<EyeSlash />
			{:else}
				<Eye />
			{/if}
		</button>
	</div>

	{#each $errors ?? [] as error}
		<small class="error">{error}</small>
	{/each}
</label>

<style>
	.input-wrapper {
		position: relative;
		margin-bottom: 2rem;
		margin-top: 0.375rem;
	}

	.input-wrapper input {
		margin-bottom: 0;
	}

	.input-wrapper input[aria-invalid] {
		padding-right: calc(var(--form-element-spacing-horizontal) + 3rem) !important;
	}

	.input-wrapper[data-invalid] .show-password-button {
		right: 2.5rem;
	}

	.show-password-button {
		position: absolute;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
