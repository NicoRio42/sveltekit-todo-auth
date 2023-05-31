<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { todoSchema } from '../../shema.js';
	import TextField from '$lib/components/form-fields/TextField.svelte';
	import CheckboxField from '$lib/components/form-fields/CheckboxField.svelte';

	export let data;

	const form = superForm(data.form, {
		validators: todoSchema,
		taintedMessage: null
	});

	const { delayed, enhance } = form;
</script>

<form action="?/update" method="POST" use:enhance novalidate>
	<h1>Edit todo</h1>

	<TextField {form} field="description" label="Description" />

	<CheckboxField {form} field="done" label="Done" />

	<button type="submit" aria-busy={$delayed}>Save changes</button>
</form>
