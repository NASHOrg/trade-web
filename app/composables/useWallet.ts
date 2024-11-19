import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
} from '@web3modal/ethers/vue';

import { BrowserProvider } from 'ethers';
// import NetworkConfig from '~/utils/networks';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '07556f4c9346cbd23fa53dde19889e99';

const metadata = {
  name: 'XBIT',
  description: 'XBIT',
  url: 'https://xbit.finance',
  icons: ['https://xbit.finance/favicon.png'],
};

let isInit = false;

export default function useWallet() {
  const { networks, network } = useNetworkConfig();

  const evmNetworks = networks.map(item => ({
    chainId: item.chainId,
    name: item.name,
    currency: item.symbol,
    explorerUrl: item.explorer,
    rpcUrl: item.rpc,
  }));

  if (!isInit) {
    createWeb3Modal({
      ethersConfig: defaultConfig({
        metadata,
        auth: { email: false, socials: [] },
      }),
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#FF7800',
        '--w3m-border-radius-master': '1.5px',
        '--w3m-z-index': 9999,
        '--w3m-font-family': 'ProtoMono, Inter',
      },
      chainImages: {
        481: network.icon,
        482: network.icon,
        11100: network.icon,
      },
      chains: evmNetworks,
      projectId,
      enableSwaps: false,
      enableOnramp: false,
    });

    isInit = true;
  }

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
        const requestChain = networks.find(c => c.chainId === chain);
        if (!requestChain) {
          return false;
        }
        await walletProvider.value // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${requestChain.chainId.toString(16)}`,
                chainName: requestChain.name,
                rpcUrls: [requestChain.rpc] /* ... */,
                blockExplorerUrls: [requestChain.explorer] /* ... */,
                nativeCurrency: {
                  name: requestChain.name,
                  symbol: requestChain.symbol,
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
