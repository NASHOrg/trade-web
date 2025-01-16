import BigNumber from 'bignumber.js';
import type { BrowserProvider, TransactionReceipt, TransactionResponse } from 'ethers';
import { assert, Contract, JsonRpcProvider } from 'ethers';
import { MAX_INTEGER } from '@ethereumjs/util';
import { ChainConfig } from '../chains';
import { erc20ABI } from './abis/erc20';

export const ORIGIN_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export class BaseEvmApi {
  constructor(rpc: string) {
    this.rpc = rpc;
  }

  readonly rpc;

  static get chianList() {
    return Object.values(ChainConfig);
  }

  static getChain(chainId: number) {
    return BaseEvmApi.chianList.find(item => Number(item.id) === chainId);
  }

  get provider() {
    return new JsonRpcProvider(this.rpc);
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  private getContractProvider<K extends 'ERC20'>(
    _contractName: K,
    contractAddress: string,
  ) {
    return new Contract(contractAddress, erc20ABI, this.provider);
  }

  isNative(contract?: string) {
    return !contract || contract.toLowerCase() === ORIGIN_TOKEN.toLowerCase();
  }

  /**
   *
   * Checks tx hash
   * @param hash Tx hash
   * @returns
   */
  async checkTransaction(hash: string) {
    const checkReceipt = (receipt: null | TransactionReceipt) => {
      if (receipt == null || receipt.status !== 0) {
        return receipt;
      }
      assert(false, 'transaction execution reverted', 'CALL_EXCEPTION', {
        action: 'sendTransaction',
        data: null, reason: null, invocation: null, revert: null,
        transaction: {
          to: receipt.to,
          from: receipt.from,
          data: '', // @TODO: in v7, split out sendTransaction properties
        }, receipt,
      });
    };
    const receipt = await this.provider.waitForTransaction(hash);
    return checkReceipt(receipt);
  }

  /**
   * Get token balance
   * @param address wallet address
   * @param contractAddress contract address
   * @returns balance
   */
  async getBalance({
    address,
    contractAddress,
  }: {
    address: string;
    contractAddress?: string;
  }): Promise<bigint> {
    if (this.isNative(contractAddress) || !contractAddress) {
      const balance = await this.provider.getBalance(address);
      return balance;
    }
    const erc20Contract = this.getContractProvider('ERC20', contractAddress!);
    const balance = await erc20Contract.balanceOf!(address);
    return balance;
  }

  /**
   *
   * Checks if the token is approved for the current contract
   *
   * @param param
   *    contract: Contract Address
   *    approveAddress Approved address
   *    address Account address
   *    amount Transaction amount
   * @returns boolean
   */
  async isApprove(param: {
    contract: string;
    approvedAddress: string;
    address?: string;
    amount: string | bigint;
  }): Promise<boolean> {
    try {
      const _address = param.address;
      if (!param.contract) return true;
      const erc20Contract = this.getContractProvider('ERC20', param.contract);
      const approved = await erc20Contract.allowance?.(
        _address,
        param.approvedAddress,
      );
      return new BigNumber(approved.toString()).gte(
        new BigNumber(param.amount.toString()),
      );
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * Approve token
   * @param provider
   * @param param
   *    contract: Contract Address
   *    approveAddress Approved address
   *    address Account address
   *    amount Transaction amount
   * @returns boolean
   */
  async approve(
    provider: BrowserProvider,
    param: {
      contract: string;
      approvedAddress: string;
      amount?: bigint;
    },
  ): Promise<TransactionResponse> {
    const erc20Contract = this.getContractProvider('ERC20', param.contract);
    const data = await erc20Contract
      .getFunction('approve')
      .populateTransaction(param.approvedAddress, param.amount ?? MAX_INTEGER);

    const signer = await provider.getSigner();
    const address = signer.address;
    await this.provider.estimateGas({ ...data, from: address });

    const res = await signer.sendTransaction(data);
    return res;
  }
}
