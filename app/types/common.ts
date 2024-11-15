import type { BlockchainUserOrders } from './swagger';

export type AccountInfo = {
  myRewards: string;
  myBalance: string;
  releaseBalance: string;
  staking?: { [key: string]: string };
  unstaked: string;
  incommingUnstaked: string;
};

export interface Token {
  address?: string;
  icon: string;
  symbol: string;
  decimals: number;
  name: string;
}

export type Order = BlockchainUserOrders['items'][0];
