import EventEmitter from 'events';
import { Address, HttpApi, TonClient } from '@ton/ton';
import { CHAIN, TonConnect } from '@tonconnect/sdk';
import { apiKey, MAINNET_API, TESTNET_API } from '../api/ton/utils';
import type { ConnectedWallet } from '~/types/common';

export class TonWalletAdapter extends EventEmitter {
  constructor(network: CHAIN, label: string) {
    super();
    this.network = network;
    this.label = label;

    const connector = new TonConnect({
      manifestUrl: new URL('/ton-manifest.json', window.location.origin).href,
    });
    /** Client api */
    const client = new TonClient({
      endpoint:
        (network === CHAIN.MAINNET ? MAINNET_API : TESTNET_API) + '/jsonRPC',
      apiKey,
    });

    /** Ton api */
    const tonApi = new HttpApi(client.parameters.endpoint, {
      timeout: client.parameters.timeout,
      apiKey,
      adapter: client.parameters.httpAdapter,
    });

    this.connector = connector;
    this.tonApi = tonApi;
    this.client = client;

    this.init();
  }

  connector!: TonConnect;
  tonApi!: HttpApi;
  client!: TonClient;
  network!: CHAIN;

  label!: string;

  async init() {
    const wallets = await this.connector.getWallets();

    this.connector.onStatusChange((walletInfo) => {
      const wallet = wallets.find((item) => {
        if (!walletInfo) {
          return this.label.toLowerCase() === item.appName.toLowerCase();
        }
        return (
          walletInfo.device.appName.toLowerCase() === item.appName.toLowerCase()
        );
      });

      console.log(wallet, walletInfo, this.label);

      if (walletInfo) {
        const _wallet: ConnectedWallet<'ton'> = {
          label: wallet?.name ?? '',
          icon: wallet?.imageUrl ?? '',
          chain: 'ton',
          provider: this,
          accounts: walletInfo?.account
            ? [
                {
                  address: Address.parse(walletInfo?.account.address).toString({
                    urlSafe: true,
                    bounceable: true,
                  }),
                },
              ]
            : [],
        };
        this.emit('accountsChanged', Object.freeze(_wallet));
      }
      else {
        this.emit('accountsChanged', {
          label: wallet?.name ?? '',
          icon: wallet?.imageUrl ?? '',
          chain: 'ton',
          provider: this,
          accounts: [],
        });
      }
    });
    this.connector.restoreConnection();
  }

  /**
   * 使用 accountsChanged 事件监控获取账户
   */
  async connectWallet(
    appName: string,
  ): Promise<ConnectedWallet<'ton'> | undefined> {
    const wallets = await this.connector.getWallets();
    const wallet = wallets.find(item => item.name === appName);
    if (wallet) {
      if (!(wallet as any).injected) {
        window.open(wallet.aboutUrl);
        throw new Error('Tonkeeper wallet not downloaded');
      }

      if (this.connector.account?.address) {
        const _wallet: ConnectedWallet<'ton'> = {
          label: wallet.name,
          icon: wallet.imageUrl,
          chain: 'ton',
          provider: this,
          accounts: this.connector.account
            ? [
                {
                  address: Address.parse(
                    this.connector?.account.address,
                  ).toString({
                    urlSafe: true,
                    bounceable: true,
                  }),
                },
              ]
            : [],
        };
        return _wallet;
      }
      this.connector.connect(wallet);

      return await new Promise((resolve, reject) => {
        this.connector.onStatusChange(
          (walletInfo) => {
            const _wallet: ConnectedWallet<'ton'> = {
              label: wallet.name,
              icon: wallet.imageUrl,
              chain: 'ton',
              provider: this,
              accounts: walletInfo?.account
                ? [
                    {
                      address: Address.parse(
                        walletInfo?.account.address,
                      ).toString({
                        urlSafe: true,
                        bounceable: true,
                      }),
                    },
                  ]
                : [],
            };

            resolve(_wallet);
            return false;
          },
          (err) => {
            reject(err);
            return false;
          },
        );
      });
      // throw new Error('Tonkeeper wallet not connected')
    }
  }

  async disconnect(): Promise<void> {
    await this.connector.disconnect();
    // const wallets = await this.connector.getWallets();
    // const wallet = wallets.find(
    //   (item) => this.label.toLowerCase() === item.appName.toLowerCase(),
    // );

    // this.emit("accountsChanged", {
    //   label: wallet?.name ?? "",
    //   icon: wallet?.imageUrl ?? "",
    //   chain: "ton",
    //   provider: this,
    //   accounts: [],
    // });
  }
}
