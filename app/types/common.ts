import type { UserDevices, UserCrowdfundingDevices } from './swagger';

export type AccountInfo = {
  myRewards: string;
  myBalance: string;
  releaseBalance: string;
  staking?: { [key: string]: string };
  unstaked: string;
  incommingUnstaked: string;
};

export type DHCListItem = UserDevices['items'][0] & UserCrowdfundingDevices['items'][0];
