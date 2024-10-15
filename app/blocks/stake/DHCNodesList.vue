<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { formatEther } from 'ethers';

const { accountInfos } = defineProps<{
  accountInfos: {
    myRewards: string;
    myBalance: string;
    releaseBalance: string;
    staking?: { [key: string]: string };
    unstaked: string;
    incommingUnstaked: string;
  } | null;
}>();

type DHCListItem = {
  deviceStateTimeOnChain: string;
  deviceState: string;
  deviceID: string;
  deviceOwnerAddress: string;
  deviceRegisterTimeOnChain: string;
  deviceTotalStake: string;
  deviceOwnerStake: string;
  voterCount: number;
  nextVoterCount: number;
  deviceMyStake: string;
  lastHeartBeat: string;
  perBill: string;
  currentStake: string;
  nextStake: string;
  yield: string;
  allowVote?: boolean;
};

const { t } = useI18n();
const router = useRouter();

const dropdownItems = ['APR', 'Voters', 'TotalStaking'].map(item => ({
  label: t(`orderBy${item}`),
  id: item,
}));

const orderBy = useStorage('hdc-orderby', 'APR');
const stakedFilter = useStorage('hdc-staked-filter', false);

const nodesFilter = ref<'crowdfunding' | 'mining'>('crowdfunding');

const dhcList = ref<DHCListItem[]>([]);

const activeOrderBy = computed({
  get: () => ({
    id: dhcListState.orderBy,
    label: t(`orderBy${dhcListState.orderBy}`.replace('Desc', '')),
  }),
  set: (value) => {
    dhcList.value = [];
    dhcListState.pageNo = 1;
    dhcListState.orderBy
        = value.id === dhcListState.orderBy ? value.id + 'Desc' : value.id;
    orderBy.value = value.id;
  },
});

const dhcListState = reactive<{
  orderBy: string;
  pageNo: number;
  stakedFilter: boolean;
}>({
  orderBy: orderBy.value as 'APR' | 'Voters' | 'TotalStaking',
  pageNo: 1,
  stakedFilter: stakedFilter.value as boolean,
});

// const { data: stakedData, status: stakedStatus } = useAsyncData(
//     `staked-list-${dhcListState.orderBy}-${dhcListState.pageNo}`,
//     () =>
//         $api.userUserVoteDevices({
//           address: user.value!.evmAddress!,
//           pageNo: 1,
//           pageSize: 100,
//           ...getOrderByValue(),
//         }),
//     { watch: [dhcListState, user], server: false },
// );

const toggleStakedOnly = computed({
  get: () => dhcListState.stakedFilter,
  set: (value) => {
    dhcList.value = [];
    dhcListState.pageNo = 1;
    dhcListState.stakedFilter = value;
    stakedFilter.value = value;
  },
});

function dhcListItemOnTap(item: DHCListItem) {
  const stakingData = accountInfos?.staking;
  const balance = accountInfos?.myBalance;
  if (!stakingData || !balance) return;
  const query = {
    dhcDID: item.deviceID,
    totalStaking: item.deviceTotalStake,
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

function dhcListItemAvatarBg(item: DHCListItem) {
  if (dhcListState.stakedFilter) {
    switch (item.deviceState) {
      case 'SERVING':
        return 'bg-[#0AC491]';
      case 'EXITING':
        return 'bg-[#AFAFAF]';
      case 'STANDBY':
        return 'bg-[#FFA92C]';
    }
  }

  return Object.keys(accountInfos?.staking ?? {}).includes(item.deviceID)
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
      return deviceState.toLowerCase();
  }
}
</script>

<template>
  <div class="mt-[28px] card w-[600px] h-[574px] flex flex-col p-[30px]">
    <div class="flex justify-around text-[28px] text-[#999]">
      <h1
        class="cursor-pointer"
        :class="nodesFilter === 'crowdfunding'?'text-primary-500':''"
        @click="nodesFilter = 'crowdfunding'"
      >
        {{ t('crowdfundingNodes') }}
      </h1>
      <h1
        class="cursor-pointer"
        :class="nodesFilter === 'mining'?'text-primary-500':''"
        @click="nodesFilter = 'mining'"
      >
        {{ t('miningNodes') }}
      </h1>
    </div>
    <h2 class="mt-[40px] text-[24px]">
      {{ t('dhcList') }}
    </h2>
    <div class="w-full flex justify-between my-[20px] text-[#999]">
      <div class="flex">
        <USelectMenu
          v-if="!dhcListState.stakedFilter"
          v-model="activeOrderBy"
          :options="dropdownItems"
          by="id"
          selected-icon=""
          :ui-menu="{ width: 'w-auto' }"
        >
          <div class="flex items-center">
            <span class="font-normal text-xs leading-3">
              {{ activeOrderBy.label }}
            </span>
            <UIcon name="bx:caret-down" />
          </div>
        </USelectMenu>
      </div>
      <div class="flex flex-row items-center justify-center">
        <p class="font-normal text-xs leading-3 me-[8px]">
          {{ t("stakedOnly") }}
        </p>
        <ClientOnly>
          <UToggle
            v-model="toggleStakedOnly"
            :ui="{
              base: '  border-[1px]',
              size: {
                md: ' h-[18px] w-[34px]',
              },
              active: 'bg-primary-500 dark:bg-primary-500',
              indicator: 'bg-[#999999] dark:bg-[#999999]',
              container: {
                base: 'bg-white dark:bg-white border-none',
                size: {
                  md: 'h-[16px] w-[16px]',
                },
              },
            }"
          />
        </ClientOnly>
      </div>
    </div>
    <div class="px-4 w-full flex flex-col items-center gap-6">
      <div
        v-for="(item, index) in dhcList"
        :key="index"
        class="flex flex-row justify-between w-full items-center cursor-pointer"
        @click="() => dhcListItemOnTap(item)"
      >
        <div class="flex flex-row items-center">
          <UAvatar
            :text="dhcListState.stakedFilter
              ? dhcListItemStateDisplay(item.deviceState)
              : item.voterCount + item.nextVoterCount > 2400
                ? t('full')
                : `${item.voterCount + item.nextVoterCount}`
            "
            :ui="{
              size: { sm: 'w-[30px] h-[30px]', md: 'w-[45px] h-[45px]' },
              background: `${dhcListItemAvatarBg(
                item,
              )} dark:${dhcListItemAvatarBg(item)}`,
              placeholder:
                'text-[12px] leading-[12px] text-white dark:text-white',
              text: dhcListState.stakedFilter
                ? 'text-[12px] leading-[14px] text-white capitalize dark:text-white'
                : 'text-[12px] leading-[12px] text-white dark:text-white',
            }"
            :size="dhcListState.stakedFilter ? 'md' : 'sm'"
          />
          <div class="ms-[8px] flex flex-col items-start font-normal">
            <p class="text-base leading-4">
              {{ item?.deviceID.slice(0, 6) }}...{{ item?.deviceID.slice(-6) }}
            </p>
            <p class="mt-1.5 text-sm leading-[14px] text-[#999]">
              {{ formatAmount(formatEther(item.deviceTotalStake ?? "0"), 2) }}
              tBOL
            </p>
          </div>
        </div>
        <div class="flex flex-row items-center gap-[16px]">
          <p class="font-normal text-[16px] leading-[16px] text-primary-500">
            {{ (Number(item?.yield ?? 0) * 100)?.toFixed(2) }}%
          </p>
          <UButton
            class="h-[26px] rounded-full text-[12px] px-[8px] leading-[12px]"
            :disabled="!accountInfos?.staking"
            :label="t('stake')"
          />
        </div>
      </div>
      <!--      <div -->
      <!--        v-if="stakedStatus === 'pending' || allStakeListStatus === 'pending'" -->
      <!--        class="flex justify-center my-auto" -->
      <!--      > -->
      <!--        <UIcon -->
      <!--          class="animate-spin text-primary-500 w-6 h-6" -->
      <!--          name="quill:loading-spin" -->
      <!--        /> -->
      <!--      </div> -->
      <div
        v-if="dhcList.length === 0"
        class="grow flex items-center justify-center pt-8"
      >
        <NuxtPicture
          class="my-auto"
          src="images/empty_box.png"
        />
      </div>
    </div>
  </div>
</template>
