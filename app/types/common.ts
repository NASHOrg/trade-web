import type EventEmitter from 'events';
import type { SolanaWalletType } from '~/utils/solana-wallets/types';
import type { SolanaWalletAdapter } from '~/utils/solana-wallets/walletsAdapter';
import type { TonWalletAdapter } from '~/utils/ton-wallets/walletsAdapter';

export type WalletName = 'bitcoin' | 'ton' | 'solana' | 'evm';

type ConnectedWalletWithOptionalSolana<
  K extends WalletName,
  X = SolanaWalletType,
> = K extends 'solana'
  ? ConnectedWallet<'solana', X extends SolanaWalletType ? X : SolanaWalletType>
  : ConnectedWallet<K>;

// WalletInfo: 当 key 是 'solana' 时，带有 X 类型的 ConnectedWallet，否则为常规 ConnectedWallet
export type WalletInfo<K extends WalletName, X = SolanaWalletType> = {
  [key in K]: ConnectedWalletWithOptionalSolana<key, X> | null;
};

// WalletInfos: 当 key 是 'solana' 时，带有 X 类型的数组，否则为常规 ConnectedWallet 数组
export type WalletInfos<K extends WalletName, X = SolanaWalletType> = {
  [key in K]: ConnectedWalletWithOptionalSolana<key, X>[];
};

type ConnectedWalletProvider<
  T extends WalletName,
  K extends SolanaWalletType = SolanaWalletType,
> = T extends 'bitcoin'
  ? BitcoinWallet
  : T extends 'ton'
    ? TonWalletAdapter
    : T extends 'solana'
      ? SolanaWalletAdapter<K>
      : any;

export interface ConnectedWallet<
  T extends WalletName,
  K extends SolanaWalletType = SolanaWalletType,
> {
  label: string;
  icon: string;
  chain: T;
  accounts: {
    address: string;
    pubkey?: string;
  }[];
  provider?: ConnectedWalletProvider<T, K>;
  chainId?: string;
}

export interface Wallet<
  T extends WalletName,
  K extends SolanaWalletType = SolanaWalletType,
> {
  connectWallet(appName?: string): Promise<ConnectedWallet<T, K> | undefined>;
  disconnect(): Promise<void>;
  checkConnected?(): Promise<void>;
}

export interface BitcoinWallet extends Wallet<'bitcoin'>, EventEmitter {
  signMessage(): Promise<string>;
}
