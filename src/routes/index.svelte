<script lang="ts">
	import { count } from '../stores/app-store';
	let firstName = '';
	let gender = 'male';
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

	async function requestFullscreen() {
		await document.documentElement.requestFullscreen();
	}
</script>

<h1>Welcome to Activity</h1>
<button on:click={requestFullscreen}>Play in fullscreen</button>

<p>
	This is using the game principles of the original Activity board game made in Germany. All credits
	go to the original publisher.
</p>

{#if firstName.length > 0}
	<h2>Hello {firstName}! {gender === 'male' ? '👨🏼' : '👩🏼'}</h2>
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

<fieldset class="button-fieldset" disabled={fieldsetDisabled}>
	<input class="radio-button" type="radio" bind:group={gender} value="male" id="male" />
	<label for="male">👨🏼 Male</label>
	<input class="radio-button" type="radio" bind:group={gender} value="female" id="female" />
	<label for="female">👩🏼 Female</label>
</fieldset>

<style>
	.count-display {
		font-size: 1em;
		margin: 14px;
	}

	label {
		margin: 10px;
		font-size: 20px;
	}

	.radio-button {
		margin: 10px 0;
		font-size: 23px;
	}
</style>
