import { useWalletGroupStore } from '~/stores/wallet';
import type { WalletName, ConnectedWallet } from '~/types/common';

export default function useWalletGroup<K extends WalletName>(label: K) {
  const walletStore = useWalletGroupStore();
  const wallets = computed(() => {
    return walletStore.walletInfos[label];
  });

  const activeWallet = computed(() => {
    return walletStore.activeWallet[label];
  });

  const address = computed(() => {
    return activeWallet.value?.accounts?.[0]?.address;
  });
  async function connectWallet(wallet: ConnectedWallet<K>) {
    if (address.value) {
      walletStore.setActiveWallet(label, wallet);
      return;
    }

    const provider = wallet.provider;

    const activeWallet = await provider?.connectWallet(wallet?.label);
    if (!activeWallet) return;
    walletStore.updateWallet(label, activeWallet);
    walletStore.setActiveWallet(label, activeWallet);
  }

  async function disconnectWallet(wallet: (typeof wallets.value)[0]) {
    await wallet.provider?.disconnect();
  }

  return {
    disconnectWallet,
    connectWallet,
    wallets,
    activeWallet,
    address,
  };
}
