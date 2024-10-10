import {
  SolflareWalletAdapter,
  PhantomWalletAdapter,
  BitgetWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import type { SolanaWalletType } from './types';
import type { ConnectedWallet } from '~/types/common';

export const SOLANA_CHAIN_IDS = [2479745243];

export const walletsAdapter = {
  solflare: SolflareWalletAdapter,
  phantom: PhantomWalletAdapter,
  bitget: BitgetWalletAdapter,
};
export const solanaWalletInfos: Record<
  SolanaWalletType,
  ConnectedWallet<'solana'>
> = (Object.keys(walletsAdapter) as string[]).reduce<
  Record<string, ConnectedWallet<'solana'>>
>((acc, key) => {
  const wallet = new walletsAdapter[key as SolanaWalletType]();

  acc[key] = {
    label: wallet.name,
    icon: wallet.icon,
    chain: 'solana',
    accounts: [],
  } as ConnectedWallet<'solana'>;
  return acc;
}, {});

export const errorInfos = {
  WalletNotReadyError: {
    message: 'Wallet not ready',
  },
  WalletLoadError: {
    message: 'Wallet not loaded',
  },
  WalletConfigError: {
    message: 'Wallet not configured',
  },
  WalletConnectionError: {
    message: 'Wallet not connected',
  },
  WalletDisconnectedError: {
    message: 'Wallet disconnected',
  },
  WalletDisconnectionError: {
    message: 'Wallet disconnection error',
  },
  WalletAccountError: {
    message: 'Wallet account error',
  },
  WalletPublicKeyError: {
    message: 'Wallet public key error',
  },
  WalletKeypairError: {
    message: 'Wallet keypair error',
  },
  WalletNotConnectedError: {
    message: 'Wallet not connected',
  },
  WalletSendTransactionError: {
    message: 'Wallet send transaction error',
  },
  WalletSignTransactionError: {
    message: 'Wallet sign transaction error',
  },
  WalletSignMessageError: {
    message: 'Wallet sign message error',
  },
  WalletSignInError: {
    message: 'Wallet sign in error',
  },
  WalletTimeoutError: {
    message: 'Wallet timeout error',
  },
  WalletWindowBlockedError: {
    message: 'Wallet window blocked error',
  },
  WalletWindowClosedError: {
    message: 'Wallet window closed error',
  },
};
