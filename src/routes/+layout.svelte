<script lang="ts">
	import { enhance } from '$app/forms';
	import { RolesEnum } from '$lib/models/enums/roles.enum';
	import './global.css';

	export let data;
</script>

<nav class="container-fluid">
	<ul>
		<li>
			<a href="/" class="brand">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
					<!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
						d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
					/>
				</svg>

				Todo
			</a>
		</li>
	</ul>

	<ul>
		{#if data.user}
			<li><a href="/profil">{data.user.name}</a></li>

			<li>
				<form use:enhance method="post" action="/logout" class="sign-out">
					<input type="submit" value="Sign out" class="sign-out-input" />
				</form>
			</li>
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

<style>
	nav {
		align-items: center;
		border-bottom: 0.125rem solid var(--table-border-color);
	}

	.brand {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.brand svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sign-out {
		margin: 0;
		padding: 0;
	}

	.sign-out-input {
		margin: -1.5rem 0;
		padding: 0;
		background-color: transparent;
		border: none;
	}
</style>
