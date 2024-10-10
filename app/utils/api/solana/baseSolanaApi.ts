import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { JSONRPC_CONFIG } from './utils';
import type { NetworkType } from '~/utils/solana-wallets/types';

export class BaseSolanaApi {
  constructor(network: NetworkType) {
    this.connection = new Connection(JSONRPC_CONFIG[network]);
  }

  connection!: Connection;

  async getBalance(param: {
    contract?: string;
    address: string;
  }): Promise<string> {
    const address = new PublicKey(param.address);

    if (!address) {
      return '0';
    }

    if (param.contract) {
      const dst = getAssociatedTokenAddressSync(
        new PublicKey(param.contract),
        address,
        true,
        TOKEN_PROGRAM_ID,
      );
      const result = await this.connection.getTokenAccountBalance(dst);
      return result.value.amount.toString();
    }
    else {
      const res = await this.connection.getBalance(address);
      return res.toString();
    }
  }
}
