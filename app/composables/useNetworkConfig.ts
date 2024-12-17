import type { Token } from '~/types/common';
import type { BlockchainPairs } from '~/types/swagger';
import { TradeApi } from '~/utils/contracts/trade';
import { betaMainnet, ultraLiquidTestnet, ethereum, sepolia } from '~/utils/networks';

export function useNetworkConfig() {
  const { currentRoute } = useRouter();
  // Fetch from server
  const pairList = useState<NonNullable<BlockchainPairs>>('paris', () => []);
  const config = useRuntimeConfig();
  const boolNetwork = config.public.network === 'beta_mainnet' ? betaMainnet : ultraLiquidTestnet;
  const bridgeNetworks = [config.public.network === 'beta_mainnet' ? ethereum : sepolia];

  const tokens = computed<{ [key: string]: Token }>(() => {
    return boolNetwork.tokens;
  });

  // const payToken = config.public.network === 'beta_mainnet' ? tokens.value.usdt! : tokens.value.usdc!;
  // const tokenPairs = [[tokens.value.bool!, payToken]];
  const pairs = pairList.value.map(pair =>
    ({
      value: pair.name,
      address: pair.address,
      label: pair.name,
      fee: '0.80%',
      price: pair.price,
      tokens: [
        {
          address: pair.tokenBAddress,
          symbol: pair.name.split('/')[0],
          decimals: Number(pair.tokenBDecimal),
          name: pair.name.split('/')[0],
          icon: pair.tokenBIcon,
        },
        {
          address: pair.tokenAAddress,
          decimals: Number(pair.tokenADecimal),
          symbol: pair.name.split('/')[1],
          name: pair.name.split('/')[1],
          icon: pair.tokenAIcon,
        },
      ],
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
    pairList,
    networks: [boolNetwork, ...bridgeNetworks],
    network: boolNetwork,
    bridgeNetworks,
    tokens,
    pairs,
    currentPair,
    tradeApi: () => new TradeApi(
      {
        rpc: boolNetwork.rpc,
        contract: currentPair.value.address,
        tokenA: currentPair.value.tokens[0]!,
        tokenB: currentPair.value.tokens[1]!,
      },
    ),
  };
}
