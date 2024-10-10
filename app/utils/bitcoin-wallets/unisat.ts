import EventEmitter from 'events';
import { bitcoinWalletInfos } from './utils';
import type { BitcoinWallet, ConnectedWallet } from '~/types/common';

const walletBaseInfo = bitcoinWalletInfos.unisat;

export class UnisatWallet extends EventEmitter implements BitcoinWallet {
  constructor() {
    super();
    this.init();
  }

  unisat: any = (window as any)?.unisat;

  async connectWallet() {
    const unisat = (window as any).unisat;
    if (!unisat) {
      throw new Error('Unisat wallet does not exist.');
    }

    if (!this.unisat) {
      this.unisat = unisat;
    }

    const accounts = await this.unisat.requestAccounts();
    const pubkey = await this.unisat.getPublicKey();
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
      const pubkey = await this.unisat.getPublicKey();
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
    const accounts = await this.unisat.getAccounts();
    const pubkey = await this.unisat.getPublicKey();
    if (accounts && accounts.length > 0) {
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };

      this.emit('accountsChanged', wallet);
    }
  };

  async disconnect() {
    this.unisat.removeListener('accountsChanged', this.accountsChanged);
    this.unisat.removeListener('networkChanged', this.networkChanged);
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
    const isConnected = this.unisat?._isUnlocked && this.unisat?._isConnected;
    if (isConnected) {
      const accounts = await this.unisat.getAccounts();
      const pubkey = await this.unisat.getPublicKey();
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };
      this.emit('accountsChanged', wallet);
    }
  }

  init() {
    this.unisat?.on('accountsChanged', this.accountsChanged);
    this.unisat?.on('networkChanged', this.networkChanged);
  }

  async signMessage() {
    return 'sign message';
  }
}
