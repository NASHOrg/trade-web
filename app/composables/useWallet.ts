import {
  createWeb3Modal,
  defaultConfig,
  useWalletInfo,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/vue';
import { BrowserProvider } from 'ethers';
import { walletConfig } from '~/app.config';
import type { ConnectedWallet } from '~/types/common';
import { BaseEvmApi } from '~/utils/api/evm/baseEvmApi';

// Set chains
const mainnet = {
  chainId: 481,
  name: 'Bool Beta Testnet',
  currency: 'tBOL',
  explorerUrl: 'https://beta-testnet.boolscan.com',
  rpcUrl: 'https://betatest-rpc-node-http.bool.network',
};
const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata: walletConfig.metadata, auth: { socials: [], email: false } }),
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#FF5a19',
    '--w3m-border-radius-master': '1.5px',
    '--w3m-z-index': 9999,
    '--w3m-font-family': 'Inter',
  },
  chains: [mainnet],
  chainImages: {
    481: 'https://bool.network/bool_logo_orange_black.svg',
  },
  projectId: walletConfig.projectId,
});

export default function useWallet() {
  const colorMode = useColorMode();
  web3Modal.setThemeMode(colorMode.value === 'dark' ? 'dark' : 'light');

  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const modal = useWeb3Modal();
  const _walletInfo = useWalletInfo();

  const walletInfo = computed<ConnectedWallet<'evm'>>(() => {
    return {
      label: _walletInfo.walletInfo.value?.name ?? '',
      icon: _walletInfo.walletInfo.value?.icon ?? '',
      chain: 'evm',
      accounts: [{ address: address.value ?? '' }],
      provider: walletProvider.value,
      chainId: chainId.value?.toString(),
    };
  });

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
        const network = BaseEvmApi.chianList.find(
          item => Number(item.id) === chain,
        );
        if (!network) {
          throw new Error('There is no wallet in the current network.');
        }

        await walletProvider.value // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chain.toString(16)}`,
                chainName: network.label,
                rpcUrls: [network.rpcUrl] /* ... */,
                blockExplorerUrls: [network.scanUrl],
                nativeCurrency: {
                  name: network.token,
                  symbol: network.token,
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

  // Sign message
  async function signMessage(message: string) {
    if (!isConnected) return undefined;
    const provider = new BrowserProvider(walletProvider.value!);
    const signer = await provider.getSigner();
    return signer?.signMessage(message);
  }

  /**
     *
     * Add the token to wallet
     *
     * @param token
     * @param provider Wallet Provider
     */
  async function addTokenToWallet(
    token: {
      address: string;
      symbol: string;
      decimals: number | string;
      icon: string;
    },
    provider: any,
  ): Promise<void> {
    await provider // Or window.ethereum if you don't support EIP-6963.
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: Number(token.decimals),
            image: token.icon,
          },
        },
      });
  }

  return {
    modal,
    walletInfo: walletInfo,
    address,
    isConnected,
    walletProvider,
    chainId,
    signMessage,
    switchNetwork,
    addTokenToWallet,
  };
}
