<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { todoSchema } from './shema.js';

	export let data;

	const { form, errors, delayed, tainted, enhance } = superForm(data.form, {
		validators: todoSchema
	});
</script>

<ul>
	{#each data.todos as todo (todo.id)}
		<li><a href="/todos/{todo.id}">{todo.description}</a></li>
	{/each}
</ul>

<form method="POST" use:enhance novalidate>
	<h1>Todos</h1>

	<label>
		Name
		<input
			name="description"
			bind:value={$form.description}
			data-invalid={$errors.description}
			aria-invalid={$tainted?.description &&
				$errors.description !== undefined &&
				$errors.description.length !== 0}
		/>

		{#each $errors.description ?? [] as descriptionError}
			<small class="error">{descriptionError}</small>
		{/each}
	</label>

	<label>
		Done
		<input
			name="done"
			type="checkbox"
			bind:checked={$form.done}
			data-invalid={$errors.done}
			aria-invalid={$tainted?.done && $errors.done !== undefined && $errors.done.length !== 0}
		/>

		{#each $errors.done ?? [] as doneError}
			<small class="error">{doneError}</small>
		{/each}
	</label>

	<button type="submit" aria-busy={$delayed}>Add todo</button>
</form>
