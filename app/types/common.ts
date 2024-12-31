import type { BlockchainUserOrders } from './swagger';
import type { IChartingLibraryWidget } from '~~/public/charting_library/charting_library';

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

export type BridgeHistory = {
  swapRecordSrcChainHash: string;
  swapRecordSrcTokenId?: string;
  swapRecordDstTokenId?: string;
  swapRecordSrcChainId?: string;
  swapRecordDstChainName?: string;
  swapRecordDstChainId?: string;
  swapRecordSrcChainName?: string;
  swapRecordDstTokenAmount?: string;
  swapRecordUserAddress?: string;
  swapRecordSrcTokenAmount?: string;
  swapRecordDstChainHash?: string;
  swapRecordSrcChainTime: string;
  swapRecordBoolChainHash?: string;
  swapRecordCrossID?: string;
  swapRecordStatus?: string;
  swapRecordCrossId?: string;
  swapRecordDstUserAddress?: string;
  swapRecordSrcTokenSymbol?: string;
  swapRecordSrcTokenName?: string;
  swapRecordDstTokenSymbol?: string;
  swapRecordDstChainTime?: string;
  swapRecordDstTokenName?: string;
  swapRecordSrcUserAddress?: string;
};

declare global {
  interface Window {
    ws: WebSocket;
    tvWidget: IChartingLibraryWidget;
  }
}
