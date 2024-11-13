import { StakeApi } from '~/utils/contracts/stake';
import { TradeApi } from '~/utils/contracts/trade';
import networksConfig from '~/utils/networks';

export function useNetworkConfig() {
  const router = useRouter();
  const config = useRuntimeConfig();

  const networks = Object.values(networksConfig);

  const currentNetwork = computed<(typeof networks)[0]>(() => {
    const { currentRoute } = router;
    const network = currentRoute.value.query.network ?? config.public.network;

    return networks.find(item => item.value === network)!;
  });

  const tokens = computed(() => {
    return currentNetwork.value.tokens;
  });

  return {
    networks,
    network: currentNetwork,
    tokens: tokens,
    stakeApi: new StakeApi(currentNetwork.value.rpc),
    tradeApi: new TradeApi({
      rpc: currentNetwork.value.rpc,
      contract: currentNetwork.value.contracts.trade!,
      usdt: tokens.value.usdt!,
    }),
  };
}
