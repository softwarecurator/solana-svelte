<script lang="ts">
	import '../app.css';
	import { SolanaProvider } from '$lib';

	const { children } = $props();
</script>

<SolanaProvider>
	{@render children()}
</SolanaProvider>
