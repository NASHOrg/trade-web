import { betaTestnet } from './networks';
import { StakeApi } from './stake';

export const NODE_CAPACITY = 3000;
export const network = betaTestnet;
export const stakeApi = new StakeApi(betaTestnet.rpc);
