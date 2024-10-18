import type { BrowserProvider } from 'ethers';
import { Contract, parseEther } from 'ethers';
import { BaseEvmApi } from './api';
import { StakeABI } from './abis/stake';

export class StakeApi extends BaseEvmApi {
  readonly contractAddress = '0x000000000000000000000000000000000000044d';
  readonly contract = new Contract(this.contractAddress, StakeABI, this.provider);

  async vote(provider: BrowserProvider, { devices, stakeAmountList }: { devices: string[]; stakeAmountList: string[] }) {
    const _stakeAmount = stakeAmountList.map(num =>
      parseEther(num).toString(),
    );
    const res = await this.contract
      .getFunction('updateVotes')
      .populateTransaction(devices, _stakeAmount);
    const signer = await provider.getSigner();
    await signer.estimateGas(res);
    return signer.sendTransaction(res);
  }

  async unlockBalance(provider: BrowserProvider) {
    const res = await this.contract
      .getFunction('unlockBalance')
      .populateTransaction();
    const signer = await provider.getSigner();
    await signer.estimateGas(res);
    return signer.sendTransaction(res);
  }

  balanceWaitingUnlockForAccount(account: string): Promise<{ blocks: bigint[]; amounts: bigint[] }> {
    return this.contract.balanceWaitingUnlockForAccount!(account);
  }

  numberOfBlocksWaitingBeforeUnlocking(): Promise<bigint> {
    return this.contract.numberOfBlocksWaitingBeforeUnlocking!();
  }

  accountVotesForNextEpoch(account: string): Promise<{ ids: string[]; amounts: bigint[] }> {
    return this.contract.accountVotesForNextEpoch!(account);
  }

  balanceWillReleaseForAccount(): Promise<bigint> {
    return this.contract.balanceWillReleaseForAccount!();
  }
}
