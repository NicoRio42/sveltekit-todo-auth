<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { todoSchema } from './shema.js';
	import { enhance as svelteEnhance } from '$app/forms';
	import Square from './components/Square.svelte';
	import SquareChecked from './components/SquareChecked.svelte';
	import Trash from './components/Trash.svelte';
	import Pen from './components/Pen.svelte';
	import Checked from './components/Checked.svelte';
	import Plus from './components/Plus.svelte';
	import TextField from '$lib/components/TextField.svelte';

	export let data;

	let todoBingEditedId: string | null = null;

	const form = superForm(data.form, {
		validators: todoSchema,
		taintedMessage: null
	});

	const { delayed, enhance } = form;
</script>

<main class="container">
	<h1>Todos</h1>

	<table>
		<thead>
			<tr>
				<th>State</th>
				<th>Description</th>
				<th />
			</tr>
		</thead>

		<tbody>
			{#each data.todos as todo (todo.id)}
				<tr>
					<td>
						<form
							action="/todos/{todo.id}?/toggleStatus"
							method="POST"
							use:svelteEnhance
							class="status-form"
						>
							<button type="submit" class="btn-unset">
								{#if todo.done}
									<SquareChecked />
								{:else}
									<Square />
								{/if}
							</button>
						</form>
					</td>

					<td>
						<div class="description-wrapper">
							{#if todo.id === todoBingEditedId}
								<form
									action="/todos/{todo.id}?/updateDescription"
									class="description-form"
									method="POST"
									use:svelteEnhance={() =>
										({ update }) => {
											todoBingEditedId = null;
											update();
										}}
								>
									<input
										name="description"
										type="text"
										class="description-input"
										value={todo.description}
									/>

									<button type="submit" class="btn-unset save-button">
										<Checked />
									</button>
								</form>
							{:else}
								<a href="/todos/{todo.id}">{todo.description}</a>

								<button
									type="button"
									class="btn-unset edit-button"
									on:click={() => (todoBingEditedId = todo.id)}
								>
									<Pen />
								</button>
							{/if}
						</div>
					</td>

					<td>
						<form
							action="/todos/{todo.id}?/delete"
							method="POST"
							use:svelteEnhance
							class="delete-form"
						>
							<button type="submit" class="btn-unset">
								<Trash />
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<form method="POST" use:enhance novalidate class="add-todo-form">
		<TextField {form} field="description" />

		<button type="submit" aria-busy={$delayed} class="btn-unset add-btn">
			<Plus />
		</button>
	</form>
</main>

<style>
	.container {
		max-width: 35rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.add-todo-form {
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.status-form,
	.delete-form {
		margin: 0;
	}

	.description-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.description-form {
		display: contents;
	}

	.description-input {
		margin: -1rem 0;
		height: 1rem;
	}

	.edit-button,
	.add-btn,
	.save-button {
		width: fit-content;
		margin-left: 0.5rem;
	}

	.add-input {
		margin-bottom: 0;
	}

	.add-btn {
		width: fit-content;
		margin-left: 1rem;
	}
</style>
