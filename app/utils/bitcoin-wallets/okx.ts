import EventEmitter from 'events';
import { bitcoinWalletInfos } from './utils';
import type { BitcoinWallet, ConnectedWallet } from '~/types/common';

const walletBaseInfo = bitcoinWalletInfos.okx;

export class OkxWallet extends EventEmitter implements BitcoinWallet {
  constructor() {
    super();
    this.init();
  }

  okx: any = (window as any).okxwallet?.bitcoin;

  async connectWallet() {
    const bitcoin = (window as any).okxwallet?.bitcoin;
    if (!bitcoin) {
      throw new Error('OKX wallet does not exist.');
    }

    if (!this.okx) {
      this.okx = bitcoin;
    }

    const accounts = await this.okx.connect();

    if (accounts) {
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts.address, pubkey: accounts.compressedPublicKey }],
        provider: this,
      };

      return Object.freeze(wallet);
    }
  }

  accountsChanged = async (accounts: any) => {
    if (accounts) {
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts.address, pubkey: accounts.compressedPublicKey }],
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
    const accounts = await this.okx.getAccounts();
    const pubkey = await this.okx.getPublicKey();

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
    this.okx.removeListener('accountsChanged', this.accountsChanged);
    this.okx.removeListener('networkChanged', this.networkChanged);
    ; (window as any).okxwallet?.disconnect?.();
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
    const isConnected = this.okx?._isUnlocked && this.okx?._isConnected;
    if (isConnected) {
      const accounts = await this.okx.getAccounts();
      const pubkey = await this.okx.getPublicKey();
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };
      this.emit('accountsChanged', wallet);
    }
  }

  init() {
    this.okx?.on('accountChanged', this.accountsChanged);
    this.okx?.on('networkChanged', this.networkChanged);
  }

  async signMessage() {
    return 'sign message';
  }
}
