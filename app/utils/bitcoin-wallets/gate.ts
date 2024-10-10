import EventEmitter from 'events';
import { bitcoinWalletInfos } from './utils';
import type { BitcoinWallet, ConnectedWallet } from '~/types/common';

const walletBaseInfo = bitcoinWalletInfos.gate;

export class GateWallet extends EventEmitter implements BitcoinWallet {
  constructor() {
    super();
    this.init();
  }

  gate: any = (window as any)?.gatewallet;
  connecting = false;
  async connectWallet() {
    try {
      this.connecting = true;
      const gate = (window as any).gatewallet;
      if (!gate) {
        throw new Error('Gate wallet does not exist.');
      }

      if (!this.gate) {
        this.gate = gate;
      }

      await this.gate.connect();
      const accounts = await new Promise<string[]>((resolve, reject) => {
        setTimeout(() => {
          this.gate.bitcoin.requestAccounts().then((res: any) => {
            resolve(res);
          }).catch((err: any) => {
            reject(err);
          });
        }, 1000);
      });

      const pubkey = await this.gate.bitcoin.getPublicKey();
      if (accounts && accounts.length > 0) {
        const wallet: ConnectedWallet<'bitcoin'> = {
          ...walletBaseInfo,
          accounts: [{ address: accounts[0] ?? '', pubkey }],
          provider: this,
        };

        return Object.freeze(wallet);
      }
    }
    catch (err) {
      this.gate?.disconnect();
      throw err;
    }
    finally {
      this.connecting = false;
    }
  }

  accountsChanged = async (accounts: string[]) => {
    if (this.connecting) return;
    if (accounts && accounts.length > 0) {
      const accounts = await this.gate.bitcoin.getAccounts();
      const pubkey = await this.gate.bitcoin.getPublicKey();

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
    if (this.connecting) return;

    const accounts = await this.gate.bitcoin.getAccounts();
    const pubkey = await this.gate.bitcoin.getPublicKey();
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
    this.gate.removeListener('accountsChanged', this.accountsChanged);
    this.gate.removeListener('networkChanged', this.networkChanged);
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
    const isConnected = this.gate?.connected;
    if (isConnected) {
      const accounts = await this.gate.getAccounts();
      const pubkey = await this.gate.getPublicKey();
      const wallet: ConnectedWallet<'bitcoin'> = {
        ...walletBaseInfo,
        accounts: [{ address: accounts[0], pubkey }],
        provider: this,
      };
      this.emit('accountsChanged', wallet);
    }
  }

  init() {
    (window as any).gatewallet?.on('accountsChanged', this.accountsChanged);
    (window as any).gatewallet?.on('networkChanged', this.networkChanged);
  }

  async signMessage() {
    return 'sign message';
  }
}
