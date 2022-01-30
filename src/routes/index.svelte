<script lang="ts">
	import { count } from '../stores/app-store';
	let firstName = '';
	$: fieldsetDisabled = firstName.length === 0;

	function increment() {
		count.update((n) => n + 1);
	}

	function decrement() {
		count.update((n) => {
			if (n !== 1) {
				return n - 1;
			}
			return n;
		});
	}
</script>

<h1>Welcome to Activity</h1>

<p>
	This is using the game principles of the original Activity board game made in Germany. All credits
	go to the original publisher.
</p>

{#if firstName.length > 0}
	<h3>Hello {firstName}!</h3>
{:else}
	<h3>Hello stranger! What is your name?</h3>
{/if}

<input type="text" min="1" bind:value={firstName} placeholder="Enter your firstname" />
<p />

<fieldset class="button-fieldset" disabled={fieldsetDisabled}>
	<button on:click={decrement}>Dec number</button>
	<button on:click={increment}>Inc number</button>
	<div class="count-display">Number: {$count}</div>
</fieldset>

<style>
	.count-display {
		font-size: 1em;
		margin: 14px;
	}
</style>
