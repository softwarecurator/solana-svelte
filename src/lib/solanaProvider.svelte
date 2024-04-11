<script lang="ts">
	import { getWallets } from '@wallet-standard/app';
	import type { Adapter } from '@solana/wallet-adapter-base';
	import { onMount, type Snippet } from 'svelte';
	import {
		WalletReadyState,
		isWalletAdapterCompatibleStandardWallet
	} from '@solana/wallet-adapter-base';
	import { StandardWalletAdapter } from '@solana/wallet-standard-wallet-adapter-base';
	import { initialize } from '@aztemi/svelte-on-solana-wallet-adapter-core';

	const {
		network = 'mainnet-beta',
		wallets = [],
		autoConnect = true,
		localStorageKey = 'walletAdapter',
		children
	}: {
		network?: string;
		wallets?: Adapter[];
		autoConnect?: boolean;
		localStorageKey?: string;
		children: Snippet;
	} = $props();

	let allWallets: Adapter[] = $state([]);

	function detectedFirst(state: any, a: Adapter, b: Adapter) {
		let sort: number = 0;
		const isDetected = (c: Adapter) => c.readyState === state;

		if (isDetected(a) && !isDetected(b)) sort = -1;
		if (!isDetected(a) && isDetected(b)) sort = 1;
		return sort;
	}

	onMount(() => {
		const { get } = getWallets();
		const standardWallets = get()
			.filter(isWalletAdapterCompatibleStandardWallet)
			.map((wallet) => new StandardWalletAdapter({ wallet }));

		// filter out non standard wallets
		const nonStandardWallets = wallets.filter(
			(wallet) => !standardWallets.some(({ name }) => wallet.name === name)
		);

		const sortedWallets = [...standardWallets, ...nonStandardWallets];

		// sort 'Installed' wallets first and 'Loadable' next
		const installedFirst = (a: Adapter, b: Adapter) =>
			detectedFirst(WalletReadyState.Installed, a, b);
		const loadableFirst = (a: Adapter, b: Adapter) =>
			detectedFirst(WalletReadyState.Loadable, a, b);

		sortedWallets.sort(loadableFirst).sort(installedFirst);

		allWallets = sortedWallets;

		initialize({
			network,
			wallets: allWallets,
			autoConnect,
			localStorageKey
		});
	});
</script>

{@render children()}
