<script lang="ts">
	import { walletStore } from '$lib';
	import { WalletReadyState } from '@solana/wallet-adapter-base';
	import Modal from '$lib/modal.svelte';

	let {
		modalVisible = $bindable(),
		maxNumberOfWallets
	}: {
		modalVisible: boolean;
		maxNumberOfWallets?: number;
	} = $props();

	let walletsAvailable = $derived(
		$walletStore.wallets.filter(
			(wallet: any) =>
				wallet.readyState === WalletReadyState.Installed ||
				wallet.readyState === WalletReadyState.Loadable
		).length
	);

	const waitForSolanaAccount = (walletType: string): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				console.log('walletType', walletType);
				$walletStore.select(walletType);
			} catch (err) {
				reject(err);
			}
			await $walletStore.connect().catch((err: any) => {
				reject(err);
			});
			console.log('connected', $walletStore.connected);
			while (!$walletStore.connected) {
				if ($walletStore.name === null) {
					reject($walletStore.onError);
					break;
				}
				//check again in 1 second
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			resolve(true);
		});
	};

	async function handleClick(walletType: string) {
		try {
			await $walletStore.disconnect();
			await waitForSolanaAccount(walletType);
			modalVisible = false;
		} catch (err) {
			console.error(err);
		}
	}
</script>

{#if walletsAvailable}
	<Modal bind:active={modalVisible}>
		<div class="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
			<div class="bg-white dark:bg-gray-800 rounded-lg p-5 max-w-sm w-full">
				<h2 class="text-lg font-semibold text-center">Select Wallet</h2>
				<button onclick={() => (modalVisible = !modalVisible)}>Close</button>
				{#each $walletStore.wallets as { adapter: { name, icon }, readyState }}
					<button onclick={() => handleClick(name)} class="w-full">
						<div
							class="border group text-sm h-11 cursor-pointer dark:border-gray-400 border-gray-500/50 rounded-full w-full text-center text-black flex items-center justify-start px-5 gap-x-3"
						>
							<img src={icon} class="mr-1 w-7 h-7" alt={`${name} icon`} />
							{name}

							<p class="text-sm text-gray-500">
								{readyState === WalletReadyState.Installed ? 'Detected' : ''}
							</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</Modal>
{:else}
	<p class="text-sm text-grey2">No Solana Wallets Found</p>
{/if}
