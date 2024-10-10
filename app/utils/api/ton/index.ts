import { CHAIN } from '@tonconnect/sdk';
import { BaseTonApi } from './baseTonApi';

const NETWORK = {
  testnet: CHAIN.TESTNET,
  mainnet: CHAIN.MAINNET,
};

export class TonApi extends BaseTonApi {
  constructor(network: keyof typeof NETWORK) {
    super(NETWORK[network]);
  }

  static CHAIN = CHAIN;
}
