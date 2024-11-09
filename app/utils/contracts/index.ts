import { betaTestnet } from './networks';
import { StakeApi } from './stake';
import { TradeApi } from './trade';

export const NODE_CAPACITY = 3000;
export const network = betaTestnet;
export const stakeApi = new StakeApi(network.rpc);

export const tradeApi = new TradeApi({
  rpc: network.rpc,
  contract: network.contracts.trade!,
  usdt: network.tokens.usdt!,
});
