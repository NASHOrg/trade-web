import type { SolanaWalletAdapter } from './walletsAdapter';

export type SolanaWalletType = 'solflare' | 'phantom' | 'bitget';
export type NetworkType = 'devnet' | 'mainnet';
type SolanaWalletMap = {
  solflare: SolanaWalletAdapter<'solflare'>;
  phantom: SolanaWalletAdapter<'phantom'>;
  bitget: SolanaWalletAdapter<'bitget'>;
};

export type ReturnProvider<T extends SolanaWalletType> =
  T extends keyof SolanaWalletMap ? SolanaWalletMap[T] : undefined;
