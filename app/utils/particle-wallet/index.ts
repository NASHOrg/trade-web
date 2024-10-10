import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from '@particle-network/aa';
import { chains } from '@particle-network/chains';
import { walletEntryPlugin } from '@particle-network/wallet';
import { UnisatConnector } from './connector';
import { SignerProvider } from './signerProvider';

const AUTO_CONNECT_KEY = 'current-connector-id';
const accountContracts = {
  BTC: [
    {
      chainIds: [223],
      version: '2.0.0',
    },
  ],
};
const particleWalletConfig = {
  projectId: '59558d19-60e0-4832-9361-0aa42252b523',
  clientKey: 'c0OwSoV4wYRhN09msVraxpolaSaVcRV9kGklpLJO',
  appId: '0756bb83-78ff-44b8-8200-fb3a1a294c24',
  aaOptions: {
    accountContracts,
  },
};

type OnAccountChange = (accounts: string[], provider?: any) => void;

// const wallet = new WalletProvider({
//   onAccountChange: (accounts, provider) => {
//     const wallet: ConnectedWallet = {
//       chain: 'evm',
//       label: 'Particle',
//       icon: 'https://3890160045-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FF6uqWeUD7kwCZqSpBtVz%2Ficon%2FQOCttrIxed6mmev66hS2%2Flogo5.png?alt=media&token=e6470b8b-906b-4da8-aa79-619ee168b2ea',
//       accounts: [{ address: accounts[0] }],
//       provider,
//     }

//     const evm = $accessor.wallet.evmWallets.find(
//       (item) => item.label === wallet.label
//     )

//     if (accounts.length === 0) {
//       $accessor.wallet.removeEvmWallet(wallet.label)
//     } else if (provider && evm?.accounts[0].address !== accounts[0]) {
//       $accessor.wallet.addEvmWallet(Object.freeze(wallet))
//     }
//   },
// })

export class WalletProvider {
  constructor(options?: {
    autoConnect?: boolean;
    onAccountChange: OnAccountChange;
  }) {
    const { autoConnect = false, onAccountChange } = options ?? {};
    this.autoConnect = autoConnect;
    this.onAccount = onAccountChange;
    this.init();
  }

  private connectors = [new UnisatConnector()];
  private autoConnect: boolean;
  private connectorId?: string;
  private accounts: string[] = [];
  private onAccount?: OnAccountChange;
  private provider?: any;
  evmAccount?: string;

  private get evmSupportChainIds() {
    let chainIds = particleWalletConfig.aaOptions.accountContracts.BTC.map(
      item => item.chainIds,
    ).reduce((a, b) => {
      a.push(...b);
      return a;
    }, []);
    chainIds = Array.from(new Set(chainIds));
    return chainIds;
  }

  private get connector() {
    return this.connectors.find(item => item.metadata.id === this.connectorId);
  }

  private get smartAccount() {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!(window as any).__bitcoinSmartAccount) {
      const smartAccount = new SmartAccount(
        new SignerProvider(
          this.evmSupportChainIds,
          particleWalletConfig.projectId,
          particleWalletConfig.clientKey,
        ) as any,
        particleWalletConfig,
      );
      smartAccount.setSmartAccountContract({
        name: 'BTC',
        version: '2.0.0',
      })
      ; (window as any).__bitcoinSmartAccount = smartAccount;
    }
    ; (window as any).__bitcoinSmartAccount.provider.getPublicKey
      = this.getPublicKey
    ; (window as any).__bitcoinSmartAccount.provider.personalSign
        = this.signMessage;
    return (window as any).__bitcoinSmartAccount as SmartAccount;
  }

  init() {
    this.initConnectorId();
    this.initWallet();

    if (this.connectorId) {
      this.connect();
    }
  }

  async connect(connectorId?: string) {
    this.connectorId = connectorId;

    if (this.connectorId) {
      localStorage.setItem(AUTO_CONNECT_KEY, this.connectorId);
    }

    await this.setWalletCore();
    await this.requestAccount();

    await this.setEvmAccount();
    await this.onAccountChange();

    console.log(this.smartAccount);
  }

  disconnect() {
    localStorage.removeItem(AUTO_CONNECT_KEY);

    if (this.connector) {
      this.connector.disconnect();
      this.walletEntryDestroy();
    }
    this.onAccount?.([]);
    this.connectorId = undefined;
    this.provider = undefined;
  }

  initConnectorId() {
    const id = localStorage.getItem(AUTO_CONNECT_KEY);
    if (this.autoConnect && id) {
      this.connectorId = id;
    }
  }

  // accounts, smartAccount
  async setEvmAccount() {
    try {
      if (this.accounts.length > 0 && this.smartAccount) {
        const res = await this.smartAccount.getAddress();

        this.evmAccount = res;
        this.walletEntryCreate();
        console.log(res, 'account evm');

        this.onAccount?.([res], this.provider);
      }
      else {
        throw new Error('Wallet not connected!');
      }
    }
    catch (err) {
      this.evmAccount = undefined;
      this.walletEntryDestroy();
      this.onAccount?.([]);

      throw err;
    }
  }

  // connector
  getPublicKey = async () => {
    if (!this.connector) {
      throw new Error('Wallet not connected!');
    }
    const pubKey = await this.connector.getPublicKey();
    return pubKey;
  };

  signMessage = async (message: string) => {
    if (!this.connector) {
      throw new Error('Wallet not connected!');
    }
    const signature = await this.connector.signMessage(message);
    return signature;
  };

  async sendBitcoin(
    toAddress: string,
    satoshis: number,
    options?: { feeRate: number },
  ) {
    if (!this.connector) {
      throw new Error('Wallet not connected!');
    }
    const signature = await this.connector.sendBitcoin(
      toAddress,
      satoshis,
      options,
    );
    return signature;
  }

  async getNetwork() {
    if (!this.connector) {
      throw new Error('Wallet not connected!');
    }
    const network = await this.connector.getNetwork();
    return network;
  }

  async switchNetwork(network: 'livenet' | 'testnet') {
    if (!this.connector) {
      throw new Error('Wallet not connected!');
    }
    await this.connector.switchNetwork(network);
  }

  // autoConnect connector, requestAccount
  async requestAccount() {
    try {
      const connector = this.connector;
      if (!connector) {
        throw new Error('Wallet not connected!');
      }
      let accounts = await connector.getAccounts();
      if (accounts.length === 0 && this.autoConnect) {
        accounts = await connector.requestAccounts();
      }
      this.accounts = accounts;

      this.provider = new AAWrapProvider(
        this.smartAccount!,
        SendTransactionMode.Gasless,
      );
    }
    catch (err) {
      this.accounts = [];
      throw err;
    }
  }

  // 监听账户切换
  onAccountChange() {
    const onAccountChange = (accounts: string[]) => {
      this.accounts = accounts;
      this.requestAccount();
      this.setEvmAccount();
    };

    this.connector?.on('accountsChanged', onAccountChange as any);

    window.onbeforeunload = () => {
      this.connector?.removeListener('accountsChanged', onAccountChange as any);
    };
  }

  initWallet() {
    const supportChains = this.evmSupportChainIds.map(id =>
      chains.getEVMChainInfoById(id),
    );
    if (supportChains.some(chain => !chain)) {
      throw new Error(
        `Please config valid chain ids, ${JSON.stringify(
          this.evmSupportChainIds,
        )}`,
      );
    }
    walletEntryPlugin.init(
      {
        ...particleWalletConfig,
      },
      {
        erc4337: {
          name: 'BTC',
          version: '1.0.0',
        },
        customStyle: {
          supportChains: supportChains as any,
          evmSupportWalletConnect: false,
        },
      },
    );
  }

  // smartAccount, options, evmSupportChainIds
  setWalletCore() {
    if (this.smartAccount) {
      walletEntryPlugin.setWalletCore({
        ethereum: this.smartAccount.provider,
      });
    }
  }

  // evmAccount, smartAccount, options, evmSupportChainIds
  walletEntryCreate() {
    walletEntryPlugin.walletEntryCreate();
  }

  // evmAccount, smartAccount, options, evmSupportChainIds
  walletEntryDestroy() {
    walletEntryPlugin.walletEntryDestroy();
  }
}
