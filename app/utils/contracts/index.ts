import { betaTestnet } from './networks';
import { StakeApi } from './stake';
import { TradeApi } from './trade';

export const NODE_CAPACITY = 3000;
export const network = betaTestnet;
export const stakeApi = new StakeApi(betaTestnet.rpc);

export const tradeApi = new TradeApi({
  rpc: betaTestnet.rpc,
  contract: betaTestnet.contracts.trade!,
  usdt: betaTestnet.tokens.usdt!,
});
