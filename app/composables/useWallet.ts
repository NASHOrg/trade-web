import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
} from '@web3modal/ethers/vue';
// import type { AppKit } from '@web3modal/base';
// import type { EthersStoreUtilState } from '@web3modal/scaffold-utils/ethers';

import { BrowserProvider } from 'ethers';
// import NetworkConfig from '~/utils/networks';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '07556f4c9346cbd23fa53dde19889e99';

// 2. Set chains
// const chains = Object.values(NetworkConfig).map((item) => {
//   return {
//     chainId: item.chainId,
//     name: item.name,
//     currency: item.symbol,
//     explorerUrl: item.explorer,
//     rpcUrl: item.rpc,
//   };
// });

// 3. Create modal
const metadata = {
  name: 'XBIT',
  description: 'XBIT for Bool Network',
  url: 'https://xbit.finance',
  icons: ['https://xbit.finance/favicon.png'],
};

let isInit = false;
// let web3Modal: AppKit<EthersStoreUtilState, number> | undefined;

export default function useWallet() {
  const { network: currentNetwork } = useNetworkConfig();

  const network = {
    chainId: currentNetwork.value.chainId,
    name: currentNetwork.value.name,
    currency: currentNetwork.value.symbol,
    explorerUrl: currentNetwork.value.explorer,
    rpcUrl: currentNetwork.value.rpc,
  };

  if (!isInit) {
    createWeb3Modal({
      ethersConfig: defaultConfig({
        metadata,
        auth: { email: false, socials: [] },
        chains: [network],
        defaultChainId: network.chainId,
        rpcUrl: network.rpcUrl,
      }),
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#FF7800',
        '--w3m-border-radius-master': '1.5px',
        '--w3m-z-index': 9999,
        '--w3m-font-family': 'ProtoMono, Inter',
      },
      chainImages: {
        481: currentNetwork.value.icon,
        482: currentNetwork.value.icon,
        11100: currentNetwork.value.icon,
      },
      defaultChain: network,
      chains: [network],
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
        await walletProvider.value // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chain.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl] /* ... */,
                blockExplorerUrls: [network.explorerUrl] /* ... */,
                nativeCurrency: {
                  name: network.name,
                  symbol: network.currency,
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
