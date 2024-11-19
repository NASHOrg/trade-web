import type { Token } from '~/types/common';
import { StakeApi } from '~/utils/contracts/stake';
import { TradeApi } from '~/utils/contracts/trade';
import { betaMainnet, betaTestnet, ethereum, sepolia } from '~/utils/networks';

export function useNetworkConfig() {
  const { currentRoute } = useRouter();
  const config = useRuntimeConfig();
  const boolNetwork = config.public.network === 'beta_mainnet' ? betaMainnet : betaTestnet;
  const bridgeNetworks = [config.public.network === 'beta_mainnet' ? ethereum : sepolia];

  const tokens = computed<{ [key: string]: Token }>(() => {
    return boolNetwork.tokens;
  });

  const payToken = config.public.network === 'beta_mainnet' ? tokens.value.usdt! : tokens.value.usdc!;
  const tokenPairs = [[tokens.value.bool!, payToken]];
  const pairs = tokenPairs.map(pair =>
    ({
      value: `BOOL/${pair[1]!.symbol}`,
      label: pair.map(item => item.symbol).join(' / '),
      type: 0,
      price: '0.01',
      tokens: pair,
    }),
  );

  const currentPair = computed(() => {
    const value = currentRoute.value.query?.pair as string | undefined;
    return (
      pairs.find(item => item.value === value)
      ?? pairs[0]!
    );
  });

  return {
    networks: [boolNetwork, ...bridgeNetworks],
    network: boolNetwork,
    bridgeNetworks,
    tokens,
    pairs,
    currentPair,
    stakeApi: new StakeApi(boolNetwork.rpc),
    tradeApi: new TradeApi({
      rpc: boolNetwork.rpc,
      contract: boolNetwork.contracts.trade!,
      token: tokens.value.usdc!,
    }),
  };
}
