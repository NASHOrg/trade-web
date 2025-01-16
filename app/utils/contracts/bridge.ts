import type { BrowserProvider } from 'ethers';
import { Contract } from 'ethers';
import { BaseEvmApi } from './api';
import BridgeABI from './abis/bridge';

export class BridgeApi extends BaseEvmApi {
  constructor(rpc: string, contractAddress: string) {
    super(rpc);
    this.contractAddress = contractAddress;
  }

  contractAddress!: string;

  get contractProvider() {
    return new Contract(this.contractAddress, BridgeABI, this.provider);
  }

  async getBridgeFee(params: {
    dstChainId: number;
    amount: bigint;
    dstRecipient: string;
    customData?: string;
  }) {
    return await this.contractProvider.getBridgeFee!(
      params.dstChainId,
      params.amount,
      params.dstRecipient,
      params.customData ?? '0x',
    );
  }

  async bridgeOut(
    provider: BrowserProvider,
    params: {
      dstChainId: number;
      amount: bigint;
      dstRecipient: string;
      customData?: string;
      isNative?: boolean;
    },
  ) {
    const txData = await this.contractProvider
      .getFunction('bridgeOut')
      .populateTransaction(
        params.dstChainId,
        params.amount,
        params.dstRecipient,
        params.customData ?? '0x',
      );
    const signer = await provider.getSigner();
    console.log(params, {
      ...txData, from: signer.address, value: params.isNative ? params.amount : 0,
    });
    // await this.provider.estimateGas({ ...txData, from: signer.address, value: params.isNative ? params.amount : 0 });
    return signer.sendTransaction({ ...txData, value: params.isNative ? params.amount : 0 });
  }
}
