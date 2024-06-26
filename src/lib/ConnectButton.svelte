<script lang="ts">
	//@ts-ignore
	import { walletStore } from '$lib';
	import WalletModal from './walletModal.svelte';

	const { maxNumberOfWallets = 3 } = $props();

	const { publicKey, wallet, disconnect } = $derived($walletStore);

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

	function handleKeyup(e: KeyboardEvent) {
		if (e.key == 'Escape') {
			closeDropdown();
		}
	}

	function showAddressContent(store = $walletStore) {
		const base58 = store.publicKey?.toBase58();
		if (!store.wallet || !base58) return null;
		return base58.slice(0, 4) + '..' + base58.slice(-4);
	}

	async function disconnectWallet() {
		closeDropdown();
		await disconnect();
	}
</script>

<svelte:window on:keyup={handleKeyup} />

{#if !wallet}
	<button
		class="px-4 py-2 bg-black/90 cursor-pointer text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all ease-in-out"
		onclick={openModal}
	>
		<p>Connect Wallet</p>
	</button>
{:else if !base58}
	<button class="px-4 py-2 bg-blue-500 text-white rounded-md" onclick={openModal}>
		<p>Select Wallet</p>
	</button>
{:else}
	<div class="relative">
		<button
			onclick={openDropdown}
			class="px-6 py-2 bg-white text-black shadow-2xl hover:scale-105 transition-all ease-in-out border-2 border-gray-300/25 cursor-pointer rounded-lg flex items-center justify-between"
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
			>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" onclick={copyAddress}>
						{copied ? 'Copied' : 'Copy address'}
					</button>
				</li>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" onclick={openModal}>
						Connect a different wallet
					</button>
				</li>
				<li role="menuitem">
					<button class="px-4 py-2 hover:bg-gray-100 w-full text-left" onclick={disconnectWallet}>
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
