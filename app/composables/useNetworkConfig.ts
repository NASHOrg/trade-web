import type { Token } from '~/types/common';
import { StakeApi } from '~/utils/contracts/stake';
import { TradeApi } from '~/utils/contracts/trade';
import networksConfig from '~/utils/networks';

export function useNetworkConfig() {
  const router = useRouter();
  const config = useRuntimeConfig();

  const networks = Object.values(networksConfig);
  const ethNetwork = config.public.network === 'beta_mainnet' ? ChainConfig.ethereum : ChainConfig.sepolia;

  const currentNetwork = computed<(typeof networks)[0]>(() => {
    const { currentRoute } = router;
    const network = currentRoute.value.query.network ?? config.public.network;

    return networks.find(item => item.value === network)!;
  });

  const tokens = computed<{ [key: string]: Token }>(() => {
    return currentNetwork.value.tokens;
  });

  const payToken = tokens.value.usdc!;

  return {
    networks,
    network: currentNetwork,
    tokens,
    payToken,
    ethNetwork,
    stakeApi: new StakeApi(currentNetwork.value.rpc),
    tradeApi: new TradeApi({
      rpc: currentNetwork.value.rpc,
      contract: currentNetwork.value.contracts.trade!,
      token: tokens.value.usdc!,
    }),
  };
}
