# @softwarecurator/solana-svelte

This npm package provides a set of tools and components designed for Svelte applications to interact with the Solana blockchain. It simplifies the process of connecting to wallets, sending transactions, and managing state within Svelte apps.

## Installation

To add this library to your Svelte project, run:

```bash
npm install @softwarecurator/solana-svelte
```

## Usages

### solanaProvider

The `solanaProvider` is a wrapper that gives access to give access to use solana throughout the application.

Example Usage:

```svelte
<script lang="ts">
	import { SolanaProvider } from '$lib';

	const { children } = $props();
</script>

<SolanaProvider>
	{@render children()}
</SolanaProvider>
```

### ConnectButton

The `ConnectButton` is a svelte component that gives the developer a quick button that will connect to the solana blockchain via detected providers

```svelte
<script lang="ts">
	import { ConnectButton } from '$lib';
</script>

<div class="flex justify-center items-center h-screen">
	<ConnectButton maxNumberOfWallets={3} />
</div>
```
