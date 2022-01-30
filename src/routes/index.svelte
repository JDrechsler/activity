<script lang="ts">
	import { count, firstname } from '../stores/app-store';
	import { gender } from '../stores/app-store';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let splashscreenIsShowing = true;
	$: fieldsetDisabled = $firstname.length === 0;

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

	onMount(async () => {
		setTimeout(() => {
			splashscreenIsShowing = false;
		}, 500);
	});
</script>

{#if splashscreenIsShowing}
	<div out:fade={{ duration: 500 }} class="splashscreen" />
{:else}
	<main>
		<h1 class="header">Welcome to Activity</h1>

		<button on:click={requestFullscreen}>Play in fullscreen</button>

		<p>
			This is using the game principles of the original Activity board game made in Germany. All
			credits go to the original publisher.
		</p>

		{#if $firstname.length > 0}
			<h2>Hello {$firstname}! {$gender === 'male' ? '👨🏼' : '👩🏼'}</h2>
		{:else}
			<h3>Hello stranger! What is your name?</h3>
		{/if}

		<input type="text" min="1" bind:value={$firstname} placeholder="Enter your firstname" />
		<p />

		<fieldset class="button-fieldset" disabled={fieldsetDisabled}>
			<button on:click={decrement}>Dec number</button>
			<button on:click={increment}>Inc number</button>
			<div class="count-display">Number: {$count}</div>
		</fieldset>

		<fieldset class="button-fieldset" disabled={fieldsetDisabled}>
			<input class="radio-button" type="radio" bind:group={$gender} value="male" id="male" />
			<label for="male">👨🏼 Male</label>
			<input class="radio-button" type="radio" bind:group={$gender} value="female" id="female" />
			<label for="female">👩🏼 Female</label>
		</fieldset>

		{#each { length: 42 } as _, i}
			<div class="list-element">{i + 1}</div>
		{/each}
	</main>
{/if}

<header />

<style>
	.splashscreen {
		height: 100vh;
		width: 100%;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		background-image: url('/static/icons/icon-512x512.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-color: var(--color-teal);
		touch-action: none;
	}

	.header {
		margin-top: env(safe-area-inset-top);
	}
	h1 {
		font-size: 2em;
		font-weight: bold;
		color: var(--color-teal);
		text-align: center;
		padding: 20px;
	}

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

	.list-element {
		font-size: 1em;
		margin: 14px 0;
		padding: 14px;
		background-color: var(--color-teal);
		color: var(--color-white);
	}
</style>
