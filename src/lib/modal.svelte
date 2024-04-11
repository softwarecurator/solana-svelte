<script lang="ts">
	import portal from './clickOutside.js';
	import { fade } from 'svelte/transition';
	import { type Snippet } from 'svelte';

	let { active = $bindable(), children }: { active: boolean; children: Snippet } = $props();
</script>

{#if active}
	<modal use:portal>
		<button
			transition:fade={{ duration: 200 }}
			class="z-[1000] fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 bg-black/60 cursor-default backdrop-blur-md transition-all ease-in-out delay-150"
			onclick={() => (active = false)}
		/>
		<div
			transition:fade={{ duration: 200 }}
			class="z-[1210] flex items-center justify-center mx-auto w-full fixed top-0 right-0 left-0 bottom-0"
		>
			{@render children()}
		</div>
	</modal>
{/if}
