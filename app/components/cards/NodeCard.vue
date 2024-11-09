<script setup lang="ts">
import { formatEther } from 'ethers';
import { formatAmount } from '~/utils/helpers';
import type { AccountInfo } from '~/types/common';
import { NODE_CAPACITY } from '~/utils/contracts';
import { shortAddress } from '#imports';

const router = useRouter();
const { t } = useI18n();
const props = defineProps<{
  item: any;
  accountInfo: AccountInfo | undefined;
  stakedFilter: boolean;
  type: 'crowdfund' | 'mine';
}>();

function dhcListItemAvatarBg(item: any) {
  if (props.stakedFilter) {
    switch (item.deviceState) {
      case 'SERVING':
        return 'bg-[#0AC491]';
      case 'EXITING':
        return 'bg-[#AFAFAF]';
      case 'STANDBY':
        return 'bg-[#FFA92C]';
    }
  }

  return Object.keys(props.accountInfo?.staking ?? {}).includes(item.deviceID)
    ? 'bg-[#FF7C43]'
    : 'bg-[#551A00]';
}

/*
 * @description Display the device state
 */
function dhcListItemStateDisplay(deviceState: string) {
  switch (deviceState) {
    case 'SERVING':
      return t('serving');
    case 'EXITING':
      return t('exiting');
    case 'STANDBY':
      return t('standby');
    default:
      return t('standBy');
  }
}

function onStake(item: any) {
  const stakingData = props.accountInfo?.staking;
  const balance = props.accountInfo?.myBalance;
  if (!stakingData || !balance) return;
  const query = {
    dhcDID: item.deviceID,
    totalStaking: item.deviceTotalStake ?? item.deviceStake,
    totalVoters: item.voterCount,
    annualYield: item.yield,
    currentStaking: stakingData[item.deviceID] ?? undefined,
    availableBalance: balance,
    devices: Object.keys(stakingData),
    stakeAmountList: Object.values(stakingData),
    allowVote: item.allowVote?.toString(),
  };
  router.push({ path: '/stake/edit', query });
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-row justify-between w-full items-center cursor-pointer"
      @click="() => onStake(item)"
    >
      <div class="flex flex-row items-center">
        <UAvatar
          :text="stakedFilter
            ? dhcListItemStateDisplay(item?.deviceState ?? '')
            : Number(item.voterCount) + Number((item.nextVoterCount ?? 0)) > NODE_CAPACITY
              ? t('full')
              : `${Number(item.voterCount) + Number((item.nextVoterCount ?? 0))}`
          "
          size="md"
          :ui="{
            size: { md: 'h-[50px] w-[50px]' },
            background: `${dhcListItemAvatarBg(
              item,
            )} dark:${dhcListItemAvatarBg(item)}`,
            placeholder:
              'text-[12px] leading-[12px] text-white dark:text-white',
            text: stakedFilter
              ? 'text-[12px] leading-[14px] text-white capitalize dark:text-white'
              : 'text-[12px] leading-[12px] text-white dark:text-white',
          }"
        />
        <div class="ms-[8px] flex flex-col items-start font-normal">
          <p class="text-base leading-4">
            {{ shortAddress(item.deviceID, 6) }}
          </p>
          <p class="mt-1.5 text-sm leading-[14px] text-[#999]">
            <span v-if="type === 'mine' || stakedFilter">
              {{ formatAmount(formatEther(item.deviceTotalStake ?? "0"), 2) }}
            </span>
            <span v-else>
              {{ `${formatAmount(formatEther(item.deviceOwnerStake ?? 0), 2)} / ${
                formatAmount(formatEther(item.deviceStake ?? 0), 2)
              }` }}
            </span>
            tBOL
          </p>
        </div>
      </div>
      <div class="flex flex-row items-center gap-[16px]">
        <p class="font-normal text-[16px] leading-[16px] text-primary-500">
          <span v-if="type === 'mine' || stakedFilter">
            {{ (Number(item?.yield ?? 0) * 100)?.toFixed(2) }}%
          </span>
          <span v-else>
            {{ item?.progress ?? 0 }}%
          </span>
        </p>
        <UButton
          class="h-[26px] rounded-[4px] text-[12px] px-[8px] leading-[12px]"
          :disabled="!accountInfo?.staking"
          color="black"
          :label="t('stake')"
        />
      </div>
    </div>
    <UProgress
      v-if="type === 'crowdfund'"
      class="h-[6px] my-[8px]"
      :value="item.progress"
    />
  </div>
</template>
