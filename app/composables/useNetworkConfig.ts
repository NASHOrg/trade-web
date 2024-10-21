import { betaTestnet } from '~/utils/contracts/networks';

export function useNetworkConfig() {
  return { network: betaTestnet, usdt: betaTestnet.tokens.usdt, bool: betaTestnet.tokens.bool };
}
