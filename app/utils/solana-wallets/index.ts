import { SolanaWalletAdapter } from './walletsAdapter';
import { SOLANA_CHAIN_IDS, solanaWalletInfos } from './utils';
import type { ReturnProvider, SolanaWalletType } from './types';
import type { ConnectedWallet } from '~/types/common';

export function getSolanaWalletProvider<K extends SolanaWalletType>(
  wallet: K,
): ReturnProvider<K> {
  const walletMap: Record<
    SolanaWalletType,
    SolanaWalletAdapter<SolanaWalletType>
  > = {
    solflare: new SolanaWalletAdapter('solflare'),
    phantom: new SolanaWalletAdapter('phantom'),
    bitget: new SolanaWalletAdapter('bitget'),
  };
  return walletMap[wallet] as ReturnProvider<K>;
}

export function getSolanaWallets(): ConnectedWallet<
  'solana',
  SolanaWalletType
>[] {
  const wallets = Object.keys(solanaWalletInfos).map((key) => {
    return {
      ...solanaWalletInfos[key as SolanaWalletType],
      provider: getSolanaWalletProvider(key as SolanaWalletType),
    };
  });
  return wallets;
}

export function isSolana(chainId: number) {
  return SOLANA_CHAIN_IDS.includes(chainId);
}
