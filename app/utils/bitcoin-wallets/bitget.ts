import EventEmitter from 'events';
import { bitcoinWalletInfos } from './utils';
import type { BitcoinWallet, ConnectedWallet } from '~/types/common';

const walletBaseInfo = bitcoinWalletInfos.bitget;

export class BitgetWallet extends EventEmitter implements BitcoinWallet {
  constructor() {
    super();
    this.init();
  }

  bitget: any = (window as any).bitkeep?.unisat;

  async connectWallet() {
    const bitget = (window as any).bitkeep?.unisat;
    if (!bitget) {
      throw new Error('Bitget wallet does not exist.');
    }

    const accounts = await this.bitget.requestAccounts();
    const pubkey = await this.bitget.getPublicKey();
    if (accounts && accounts.length > 0) {
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };

      return Object.freeze(wallet);
    }
  }

  accountsChanged = async (accounts: string[]) => {
    if (accounts && accounts.length > 0) {
      const pubkey = await this.bitget.getPublicKey();
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };
      this.emit('accountsChanged', Object.freeze(wallet));
    }
    else {
      this.emit('accountsChanged', {
        ...walletBaseInfo,
        accounts: [],
        provider: this,
      });
    }
  };

  networkChanged = async () => {
    const accounts = await this.bitget.getAccounts();
    const pubkey = await this.bitget.getPublicKey();
    if (accounts && accounts.length > 0) {
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };

      this.emit('accountsChanged', Object.freeze(wallet));
    }
  };

  async disconnect() {
    this.bitget.removeListener('accountsChanged', this.accountsChanged);
    this.bitget.removeListener('networkChanged', this.networkChanged);
    this.emit('accountsChanged', {
      ...walletBaseInfo,
      accounts: [],
      provider: this,
    });
  }

  /**
 * 检查钱包是否连接
 */
  async checkConnected() {
    const isConnected = this.bitget?._isUnlocked && this.bitget?._isConnected;

    if (isConnected) {
      const accounts = await this.bitget.getAccounts();
      const pubkey = await this.bitget.getPublicKey();
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };
      this.emit('accountsChanged', wallet);
    }
  }

  init() {
    this.bitget?.on('accountsChanged', this.accountsChanged);
    this.bitget?.on('networkChanged', this.networkChanged);
  }

  async signMessage() {
    return 'sign message';
  }
}
