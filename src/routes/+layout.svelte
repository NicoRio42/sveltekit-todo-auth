<script lang="ts">
	import { enhance } from '$app/forms';
	import { RolesEnum } from '$lib/models/enums/roles.enum';
	import './global.css';

	export let data;
</script>

<nav class="container-fluid">
	<ul>
		<li><a href="/">Todo</a></li>

		{#if data.user}
			<li><a href="/profil">{data.user.name}</a></li>

			<form use:enhance method="post" action="/logout">
				<input type="submit" value="Sign out" />
			</form>
		{:else}
			<li><a href="/signup">Signup</a></li>
			<li><a href="/login">Login</a></li>
		{/if}

		{#if data.user?.role === RolesEnum.Enum.admin}
			<li><a href="/admin/users">Users</a></li>
		{/if}
	</ul>
</nav>

<slot />
