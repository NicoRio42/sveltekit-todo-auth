<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
</script>

<h1>{data.user.name}</h1>

<form method="POST" use:enhance>
	<input type="submit" value="Delete account" />
</form>
