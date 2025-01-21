import type { BrowserProvider } from 'ethers';
import { Contract, zeroPadValue } from 'ethers';
import { PoolABI } from './abis/pool';
import { BaseEvmApi } from './api';
import { SwapABI } from './abis/swap';
import type { Token } from '~/types/common';

export class SwapApi extends BaseEvmApi {
  constructor(rpc: string, contractAddress: string) {
    super(rpc);
    this.contractAddress = contractAddress;
  }

  contractAddress!: string;

  get contractProvider() {
    return new Contract(this.contractAddress, SwapABI, this.provider);
  }

  async swapLimit(token: Token) {
    const poolContract = new Contract(
      token.pool!,
      PoolABI,
      this.provider,
    );
    const limit = await poolContract.swapLimit!();
    return limit;
  }

  async transferLimit(token: Token) {
    const poolContract = new Contract(
      token.pool!,
      PoolABI,
      this.provider,
    );
    const limit = await poolContract.liquidity!();

    return limit;
  }

  async swapFeeRatio(token: Token) {
    try {
      const poolContract = new Contract(
        token.pool!,
        PoolABI,
        this.provider,
      );
      const feeRatio = await poolContract.feeRatio!();

      return Number(feeRatio ?? '0') / 1000000;
    }
    catch {
      return 0;
    }
  }

  async boolFee(
    param: {
      poolId: number;
      dstChainId: number;
      amount: bigint;
      recipient: string;
      consumerData: string;
    },
  ) {
    try {
      const _recipient = zeroPadValue(param.recipient, 32);
      const fee = await this.contractProvider.estimateBNFee!(
        BigInt(param.poolId),
        param.dstChainId,
        param.amount,
        _recipient,
        param.consumerData,
      );
      return fee.toString();
    }
    catch {
      return '0';
    }
  }

  // For liquidity bridge
  async swap(
    provider: BrowserProvider,
    params: {
      poolId: number;
      dstChainId: number;
      amount: bigint;
      dstRecipient: string;
      refundAddress: string;
      customData?: string;
      isNative?: boolean;
    },

  ) {
    const _recipient = zeroPadValue(params.dstRecipient, 32);
    const txData = await this.contractProvider
      .getFunction('swap')
      .populateTransaction(
        params.poolId,
        params.dstChainId,
        params.amount,
        _recipient,
        params.refundAddress,
        params.customData ?? '0x',
      );
    const signer = await provider.getSigner();
    // await this.provider.estimateGas({ ...txData, from: signer.address, value: params.isNative ? params.amount : 0 });
    console.log(
      { ...txData, value: params.isNative ? params.amount : undefined },
    );
    return signer.sendTransaction({ ...txData, value: params.isNative ? params.amount : undefined });
  }
}
