import EventEmitter from 'events';
import type { PublicKey } from '@solana/web3.js';
import { errorInfos, solanaWalletInfos, walletsAdapter } from './utils';
import type { SolanaWalletType } from './types';
import type { ConnectedWallet } from '~/types/common';

const walletBaseInfos = solanaWalletInfos;
export class SolanaWalletAdapter<
  K extends SolanaWalletType,
> extends EventEmitter {
  constructor(label: K) {
    super();
    const wallet = new walletsAdapter[label]();
    this.wallet = wallet as InstanceType<(typeof walletsAdapter)[K]>;
    this.label = label;

    this.init();
  }

  label!: K;
  wallet!: InstanceType<(typeof walletsAdapter)[K]>;

  get publicKey() {
    return this.wallet.publicKey;
  }

  init() {
    this.wallet.on('connect', (publicKey: PublicKey) => {
      if (publicKey) {
        const wallet: ConnectedWallet<'solana', K> = {
          ...walletBaseInfos[this.label],
          accounts: [{ address: publicKey.toBase58() }],
          provider: this,
        };

        this.emit('accountsChanged', Object.freeze(wallet));
      }
    });
    this.wallet.on('disconnect', () => {
      this.emit('accountsChanged', {
        ...walletBaseInfos[this.label],
        accounts: [],
        provider: this,
      });
    });
  }

  async connectWallet(): Promise<ConnectedWallet<'solana'> | undefined> {
    try {
      await this.wallet.connect();
      const pubkey = this.wallet.publicKey;
      if (!pubkey) {
        throw new Error('Wallet not connected');
      }
      const wallet: ConnectedWallet<'solana', K> = {
        ...walletBaseInfos[this.label],
        accounts: [{ address: pubkey.toBase58() }],
        provider: this,
      };
      return wallet;
    }
    catch (err) {
      if (err instanceof Error) {
        const message = errorInfos[err.name as keyof typeof errorInfos];
        if (message) {
          throw new Error(message.message);
        }
        else {
          throw new Error(err.message);
        }
      }
      else {
        throw new Error('Failed to connect wallet');
      }
    }
  }

  async checkConnected(): Promise<void> {
    const isConnected = this.wallet.connected;

    if (isConnected) {
      const publicKey = this.wallet.publicKey;
      const wallet: ConnectedWallet<'solana', K> = {
        ...walletBaseInfos[this.label],
        accounts: publicKey ? [{ address: publicKey.toBase58() }] : [],
        provider: this,
      };

      this.emit('accountsChanged', Object.freeze(wallet));
    }
  }

  async disconnect(): Promise<void> {
    await this.wallet.disconnect();
  }
}
