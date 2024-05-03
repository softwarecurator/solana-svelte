<script lang="ts">
	//@ts-ignore
	import { walletStore } from '$lib';
	import { WalletReadyState } from '@solana/wallet-adapter-base';
	import Modal from '$lib/modal.svelte';
	import { fly } from 'svelte/transition';

	let {
		modalVisible = $bindable(),
		maxNumberOfWallets = 3
	}: {
		modalVisible: boolean;
		maxNumberOfWallets: number;
	} = $props();

	let showMoreOptions = $state(false);

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
		<div class="fixed inset-0 bg-black/5 flex justify-center items-center close-button">
			<div
				transition:fly={{ y: 200, duration: 300 }}
				class="bg-gray-800 rounded-3xl shadow-xl p-5 max-w-sm w-full relative"
			>
				<h2 class="text-lg text-white font-semibold text-center mb-6">Connect a Wallet</h2>
				<button
					class="absolute text-white cursor-pointer right-0 bg-gray-700 rounded-full top-0 p-2 m-2 text-white"
					onclick={() => (modalVisible = !modalVisible)}
				>
					<svg
						width="13"
						height="13"
						fill="currentColor"
						viewBox="0 0 13 13"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11.25 0.75L6.5 5.5L1.75 0.75L0.75 1.75L5.5 6.5L0.75 11.25L1.75 12.25L6.5 7.5L11.25 12.25L12.25 11.25L7.5 6.5L12.25 1.75L11.25 0.75Z"
						/>
					</svg>
				</button>
				<div class="flex flex-col gap-2">
					{#each $walletStore.wallets.slice(0, maxNumberOfWallets) as { adapter: { name, icon }, readyState }}
						<button onclick={() => handleClick(name)} class="w-full">
							<div
								class="border hover:bg-gray-700 group text-sm h-11 cursor-pointer dark:border-gray-400 border-gray-500/50 rounded-full w-full text-center text-white flex items-center justify-start px-5 gap-x-3"
							>
								<img src={icon} class="mr-1 w-7 h-7" alt={`${name} icon`} />
								{name}

								<p class="text-sm text-gray-400">
									{readyState === WalletReadyState.Installed ? 'Detected' : ''}
								</p>
							</div>
						</button>
					{/each}
				</div>
				{#if $walletStore.wallets.length > maxNumberOfWallets}
					<button class="wallet-adapter-modal-list-more" style="justify-content: space-between;">
						<span>
							{showMoreOptions ? 'Less' : 'More'} options
						</span>

						<svg
							width="13"
							height="7"
							viewBox="0 0 13 7"
							xmlns="http://www.w3.org/2000/svg"
							class:wallet-adapter-modal-list-more-icon-rotate={showMoreOptions}
							><path
								d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z"
							/></svg
						>
					</button>
				{/if}
			</div>
		</div>
	</Modal>
{:else}
	<p class="text-sm text-grey2">No Solana Wallets Found</p>
{/if}
