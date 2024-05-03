<script lang="ts">
	import '../app.css';
	//@ts-ignore
	import { SolanaProvider } from '$lib';

	const { children } = $props();
</script>

<SolanaProvider>
	{@render children()}
</SolanaProvider>
