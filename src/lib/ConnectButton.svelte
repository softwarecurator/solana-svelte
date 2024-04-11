<script lang="ts">
	import { walletStore } from '$lib';
	import portal from './clickOutside.js';
	import WalletModal from './walletModal.svelte';

	const { maxNumberOfWallets = 3 } = $props();

	const { publicKey, wallet, disconnect, connect, select } = $derived($walletStore);

	let dropDrownVisible = $state(false),
		modalVisible = $state(false),
		copied = $state(false);

	let base58 = $derived(publicKey && publicKey?.toBase58());
	let content = $derived(showAddressContent($walletStore));

	const copyAddress = async () => {
		if (!base58) return;
		await navigator.clipboard.writeText(base58);
		copied = true;
		setTimeout(() => (copied = false), 400);
	};

	const openDropdown = () => (dropDrownVisible = true);
	const closeDropdown = () => (dropDrownVisible = false);

	const openModal = () => {
		modalVisible = true;
		closeDropdown();
	};

	const closeModal = () => (modalVisible = false);

	function handleKeyup(e) {
		if (e.key == 'Escape') {
			closeDropdown();
		}
	}

	function showAddressContent(store = $walletStore) {
		const base58 = store.publicKey?.toBase58();
		if (!store.wallet || !base58) return null;
		return base58.slice(0, 4) + '..' + base58.slice(-4);
	}

	async function disconnectWallet(event: MouseEvent) {
		closeDropdown();
		await disconnect();
	}
</script>

<svelte:window on:keyup={handleKeyup} />

{#if !wallet}
	<button class="px-4 py-2 bg-blue-500 text-white rounded-md" onclick={openModal}>
		<p>Select Wallet</p>
	</button>
{:else if !base58}
	<button class="px-4 py-2 bg-blue-500 text-white rounded-md" onclick={openModal}>
		<p>Select Wallet</p>
	</button>
{:else}
	<div class="relative">
		<button
			onclick={openDropdown}
			class="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-between"
		>
			<div class="flex items-center">
				<img src={wallet.icon} alt={`${wallet.name} icon`} class="w-6 h-6 mr-2" />
				<span>{content}</span>
			</div>
		</button>
		{#if dropDrownVisible}
			<ul
				aria-label="dropdown-list"
				class="absolute bg-white shadow-md mt-2 py-1 w-48 rounded-md z-10"
				role="menu"
				use:portal
			>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" on:click={copyAddress}>
						{copied ? 'Copied' : 'Copy address'}
					</button>
				</li>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" on:click={openModal}>
						Connect a different wallet
					</button>
				</li>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" on:click={disconnectWallet}>
						Disconnect
					</button>
				</li>
			</ul>
		{/if}
	</div>
{/if}

{#if modalVisible}
	<WalletModal bind:modalVisible {maxNumberOfWallets} />
{/if}
