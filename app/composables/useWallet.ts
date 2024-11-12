import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
} from '@web3modal/ethers/vue';
import { BrowserProvider } from 'ethers';
import NetworkConfig from '~/utils/networks';

const network = NetworkConfig.beta_testnet;

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '07556f4c9346cbd23fa53dde19889e99';

// 2. Set chains
const chains = Object.values(NetworkConfig).map((item) => {
  return {
    chainId: item.chainId,
    name: item.name,
    currency: item.symbol,
    explorerUrl: item.explorer,
    rpcUrl: item.rpc,
  };
});

// 3. Create modal
const metadata = {
  name: 'XBIT',
  description: 'Bool campaign',
  url: 'https://xbit.finance',
  icons: ['https://xbit.finance/favicon.svg'],
};
// let signing: string | undefined;
createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    auth: { email: false, socials: [] },
  }),
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FF5a19',
    '--w3m-border-radius-master': '1.5px',
    '--w3m-z-index': 9999,
    '--w3m-font-family': 'Roboto',
  },
  chains,
  chainImages: {
    481: 'https://bool.network/bool-network.png',
    479: 'https://bool.network/bool-network.png',
    11100: 'https://bool.network/bool-network.png',
  },
  projectId,
  enableSwaps: false,
  enableOnramp: false,
});

export default function useWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider();

  async function switchNetwork(chain: number) {
    if (chain === Number(chainId.value)) return true;
    if (!walletProvider.value) {
      throw new Error('Wallet provider is not available.');
    }

    try {
      await walletProvider.value?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chain.toString(16)}` }],
      });
      return true;
    }
    catch (err: any) {
      if (err.code === 4902) {
        await walletProvider.value // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chain.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpc] /* ... */,
                blockExplorerUrls: [network.explorer] /* ... */,
                nativeCurrency: {
                  name: network.symbol,
                  symbol: network.symbol,
                  decimals: 18,
                },
              },
            ],
          });

        return await switchNetwork(chain);
      }
      else {
        throw err;
      }
    }
  }
  async function signMessage(message: string) {
    if (!isConnected) {
      return;
    }
    const provider = new BrowserProvider(walletProvider.value!);
    const signer = await provider.getSigner();
    const signature = await signer?.signMessage(message);
    return signature;
  }

  return {
    address,
    isConnected,
    walletProvider,
    chainId,
    provider: () => new BrowserProvider(walletProvider.value!),
    signMessage,
    switchNetwork,
    open,
    disconnect,
  };
}
