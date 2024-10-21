<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import type { AccountInfo, DHCListItem } from '~/types/common';

const { $api } = useNuxtApp();
const { address } = useWallet();
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  accountInfo: AccountInfo | undefined;
  type: 'crowdfund' | 'mine';
}>();

const { t } = useI18n();

const dropdownItems = ['APR', 'Voters', 'TotalStaking'].map(item => ({
  label: t(`orderBy${item}`),
  id: item,
}));

const orderBy = useStorage('hdc-orderby', 'APR');
const stakedFilter = computed({
  get: () => route.query.staked === 'true',
  set(value) {
    router.replace({ query: { ...route.query, staked: value ? 'true' : undefined } });
  },
});

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
}>({
  orderBy: orderBy.value,
  pageNo: 1,
});

useInfiniteScroll(
  document,
  (state) => {
    if (state.arrivedState.bottom) dhcListState.pageNo++;
  },
  {
    canLoadMore() {
      if (dhcList.value.length === 0 && dhcListState.pageNo === 1) return false;
      if (allStakeListStatus.value !== 'success') return false;
      return data?.value?.totalPage !== undefined
        ? dhcListState.pageNo < data?.value?.totalPage
        : true;
    },
    distance: 20,
  },
);

function getOrderByValue() {
  switch (dhcListState.orderBy) {
    case 'APR':
      return { yield: '1' };
    case 'APRDesc':
      return { yield: '0' };
    case 'Voters':
      return { voters: '1' };
    case 'VotersDesc':
      return { voters: '0' };
    case 'TotalStaking':
      return { totalStake: '1' };
    case 'TotalStakingDesc':
      return { totalStake: '0' };
    default:
      return {};
  }
}

const { data, status: allStakeListStatus } = useAsyncData(
  `stake-list-${props.type}-${dhcListState.orderBy}-${dhcListState.pageNo}`,
  () => {
    if (props.type === 'mine') {
      return $api.userDevices({
        pageNo: dhcListState.pageNo,
        pageSize: 20,
        ...getOrderByValue(),
      });
    }
    else {
      return $api.userCrowdfundingDevices({
        pageNo: dhcListState.pageNo,
        pageSize: 20,
      });
    }
  },
  { watch: [dhcListState], immediate: true, server: false },
);

watch(data, () => {
  if (data.value?.items) {
    dhcList.value = [...dhcList.value, ...data.value.items];
  }
});

const { data: stakedData, status: stakedStatus } = useAsyncData(
  `staked-list-${address.value}`,
  async () => {
    if (!address.value) return;
    if (props.type === 'mine') {
      return $api.userVoteDevices({
        address: address.value,
        pageNo: 1,
        pageSize: 100,
      });
    }
    else {
      return $api.userCrowdfundingDevices({
        address: address.value,
        pageNo: 1,
        pageSize: 100,
      });
    }
    return data;
  },
  { watch: [address], immediate: true, server: false },
);
const stakedList = computed<DHCListItem[]>(() => {
  return stakedData.value?.items ?? [];
});
</script>

<template>
  <div class="w-full flex flex-col">
    <h2 class="mt-[40px]">
      {{ t('dhcList') }}
    </h2>
    <div class="w-full flex justify-between my-[20px] text-[#999]">
      <div class="flex">
        <USelectMenu
          v-if="!stakedFilter && type === 'mine'"
          v-model="activeOrderBy"
          :options="dropdownItems"
          by="id"
          selected-icon=""
          :ui-menu="{ width: 'w-auto' }"
        >
          <div class="flex items-center">
            <span class="text-[18px]">
              {{ activeOrderBy.label }}
            </span>
            <UIcon
              class="ms-[6px]"
              name="bx:caret-down"
            />
          </div>
        </USelectMenu>
      </div>
      <div class="flex flex-row items-center justify-center">
        <p class="font-normal text-xs leading-3 me-[8px]">
          {{ type === 'crowdfund' ? t("joinedOnly") : t("stakedOnly") }}
        </p>
        <ClientOnly>
          <UToggle v-model="stakedFilter" />
        </ClientOnly>
      </div>
    </div>
    <div
      v-show="stakedFilter"
      class="w-full flex flex-col items-center gap-6"
    >
      <div
        v-if="stakedStatus === 'pending'"
        class="flex justify-center my-auto py-8"
      >
        <UIcon
          class="animate-spin text-primary-500 w-6 h-6"
          name="quill:loading-spin"
        />
      </div>
      <div
        v-else-if="stakedList.length === 0"
        class="grow flex items-center justify-center py-8"
      >
        <NuxtPicture
          class="my-auto"
          width="80"
          src="images/empty_box.png"
        />
      </div>
      <template v-else>
        <NodeCard
          v-for="item in stakedList"
          :key="item.deviceID"
          :item="item"
          :account-info="accountInfo"
          :staked-filter="stakedFilter"
          type="mine"
        />
      </template>
    </div>
    <div
      v-show="!stakedFilter"
      class="w-full flex flex-col items-center gap-6"
    >
      <div
        v-if="allStakeListStatus === 'success' && dhcList.length === 0"
        class="grow flex items-center justify-center py-8"
      >
        <NuxtPicture
          class="my-auto"
          width="80"
          src="images/empty_box.png"
        />
      </div>
      <template v-else>
        <NodeCard
          v-for="item in dhcList"
          :key="item.deviceId ?? item.deviceID"
          :item="item"
          :account-info="accountInfo"
          :staked-filter="stakedFilter"
          :type="type"
        />
      </template>
      <div
        v-if="allStakeListStatus === 'pending'"
        class="flex justify-center my-auto py-2"
      >
        <UIcon
          class="animate-spin text-primary-500 w-6 h-6"
          name="quill:loading-spin"
        />
      </div>
    </div>
  </div>
</template>
