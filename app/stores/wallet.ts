import { CHAIN } from '@tonconnect/sdk';
import { defineStore, skipHydrate } from 'pinia';
import type {
  WalletInfo,
  ConnectedWallet,
  WalletInfos,
  WalletName,
} from '~/types/common';
import { getBitcoinWallets } from '~/utils/bitcoin-wallets';
import { getSolanaWallets } from '~/utils/solana-wallets';
import { getTonWallets } from '~/utils/ton-wallets';

export const useWalletGroupStore = defineStore('wallet-group', () => {
  const activeWallet = ref<WalletInfo<WalletName>>({
    bitcoin: null,
    ton: null,
    solana: null,
    evm: null,
  });

  activeWallet.value.ton?.provider;

  const walletInfos = ref<WalletInfos<WalletName>>({
    bitcoin: import.meta.server ? [] : getBitcoinWallets(),
    solana: import.meta.server ? [] : getSolanaWallets(),
    ton: [],
    evm: [],
  });

  function setActiveWallet<K extends WalletName>(
    label: K,
    wallet?: ConnectedWallet<K> | null,
  ) {
    activeWallet.value[label] = wallet as any;
  }

  function updateWallet<K extends WalletName>(
    label: K,
    wallet: ConnectedWallet<K>,
  ) {
    const wallets = walletInfos.value[label];
    const i = wallets.findIndex(
      item =>
        'label' in item && 'label' in wallet && item.label === wallet.label,
    );
    if (i !== -1) {
      wallets.splice(i, 1, wallet as any);
    }
  }

  function accountsChanged<K extends WalletName>(
    label: K,
    wallet: ConnectedWallet<K>,
  ) {
    updateWallet(label, wallet);

    const address = wallet.accounts?.[0]?.address;
    if (!address) {
      const wallets = walletInfos.value[label];
      const connected = wallets.find(item => item.accounts?.[0]?.address) as
        | ConnectedWallet<K>
        | undefined;

      setActiveWallet(label, connected ?? null);
    }
    else {
      setActiveWallet(label, wallet);
    }
  }

  function networkChanged<K extends WalletName>(
    label: K,
    wallet: ConnectedWallet<K>,
  ) {
    updateWallet(label, wallet);
  }

  async function getTonWalletInfos() {
    try {
      const tonWallets = import.meta.server
        ? []
        : await getTonWallets(CHAIN.TESTNET);
      walletInfos.value.ton = tonWallets;
    }
    catch (error) {
      console.log(error);
    }
  }

  onMounted(async () => {
    await getTonWalletInfos();

    if (!import.meta.server) {
      // 监听各个钱包的账户变化
      (Object.keys(walletInfos.value) as WalletName[]).forEach((k) => {
        const wallets = walletInfos.value[k];
        wallets.forEach((item) => {
          const provider = item.provider;

          provider?.on(
            'accountsChanged',
            (wallet: ConnectedWallet<typeof item.chain>) =>
              accountsChanged(item.chain, wallet),
          );
          provider?.on(
            'networkChanged',
            (wallet: ConnectedWallet<typeof item.chain>) =>
              networkChanged(item.chain, wallet),
          );
          // provider?.checkConnected?.();
        });
      });
    }
  });

  return {
    activeWallet,
    setActiveWallet,
    walletInfos: skipHydrate(walletInfos),
    updateWallet,
  };
});
