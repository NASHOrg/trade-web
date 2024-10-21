import type { BrowserProvider } from 'ethers';
import { Contract } from 'ethers';
import BN from 'bignumber.js';
import { BaseEvmApi } from './api';
import { TradeABI } from './abis/trade';

export class TradeApi extends BaseEvmApi {
  constructor({ rpc, usdt, contract }: { rpc: string; usdt: { address: string; decimals: number } ; contract: string }) {
    super(rpc);
    this.contractAddress = contract;
    this.usdt = usdt;
  }

  readonly usdt;
  readonly contractAddress: string;

  get contract() { return new Contract(this.contractAddress, TradeABI, this.provider); };

  async createBuyOrder(provider: BrowserProvider, { amount, pay }: { amount: bigint; pay: bigint }) {
    const res = await this.contract
      .getFunction('placeOrderBuyB')
      .populateTransaction(pay, amount);
    const signer = await provider.getSigner();
    await signer.estimateGas(res);
    return signer.sendTransaction(res);
  }

  async createSellOrder(provider: BrowserProvider, { amount, receive }: { amount: bigint; receive: bigint }) {
    const res = await this.contract
      .getFunction('placeOrderSellB')
      .populateTransaction(receive, { value: amount });
    const signer = await provider.getSigner();
    await signer.estimateGas(res);
    return signer.sendTransaction(res);
  }

  async cancelOrder(provider: BrowserProvider, { orderId, type }: { orderId: bigint; type: 'buy' | 'sell' }) {
    const res = await this.contract
      .getFunction(type === 'buy' ? 'cancelOrderBuyB' : 'cancelOrderSellB')
      .populateTransaction(orderId);
    const signer = await provider.getSigner();
    await signer.estimateGas(res);
    return signer.sendTransaction(res);
  }

  isUsdtApproved(address: string, amount: bigint) {
    return super.isApprove({
      contract: this.usdt.address,
      approvedAddress: this.contractAddress,
      amount,
      address,
    });
  }

  approveUsdt(provider: BrowserProvider) {
    return super.approve(provider, {
      contract: this.usdt.address,
      approvedAddress: this.contractAddress,
    });
  }

  calcUsdt(price: string, bool: string) {
    console.log(price, bool);
    const receive = BN(bool).times(BN(price)).times(10 ** this.usdt.decimals).toFixed();
    return BigInt(receive);
  }
}
