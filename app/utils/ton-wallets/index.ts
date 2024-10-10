import { TonConnect, type CHAIN } from '@tonconnect/sdk';
import { TonWalletAdapter } from './walletsAdapter';
import { TON_CHAIN_IDS } from './utils';
import type { ConnectedWallet } from '~/types/common';

export type TonWalletType = 'tonWalletAdapter' | 'get';

type TonWalletMap = {
  tonWalletAdapter: TonWalletAdapter;
  get: any;
};

type ReturnProvider<T extends TonWalletType> = T extends keyof TonWalletMap
  ? TonWalletMap[T]
  : undefined;

export function getTonWalletProvider<K extends TonWalletType>(
  wallet: K,
  network: CHAIN,
  label: string,
): ReturnProvider<K> {
  const walletMap: TonWalletMap = {
    tonWalletAdapter: new TonWalletAdapter(network, label),
    get: {},
  };

  return walletMap[wallet];
}

export async function getTonWallets(
  network: CHAIN,
): Promise<ConnectedWallet<'ton'>[]> {
  const connector = new TonConnect({
    manifestUrl: new URL('/ton-manifest.json', window.location.origin).href,
  });
  const res = await connector.getWallets();
  return res
    .filter(item => (item as any).injected)
    .map((item) => {
      return {
        label: item.name,
        icon: item.imageUrl,
        chain: 'ton',
        accounts: [],
        provider: getTonWalletProvider(
          'tonWalletAdapter',
          network,
          item.appName,
        ),
      };
    });
}

export function isTon(chainId: number) {
  return TON_CHAIN_IDS.includes(chainId);
}
