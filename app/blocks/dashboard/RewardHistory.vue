<script setup lang="ts">
import type { PowerList } from '~/types/swagger';

const { t } = useI18n();
const { $api } = useNuxtApp();
const { user, token } = useUserStore();

const props = defineProps<{ mode: 'team' | 'self' }>();

const rewardsHistoryListState = reactive<{
  pageNo: number;
}>({ pageNo: 1 });

type PowerListItem = PowerList['items'][0] & { rank: string };

const rewardsHistoryList = ref<PowerListItem[]>([]);

const { data: rewardsData, status: rewardsStatus } = useAsyncData(
  `rewards-history-${rewardsHistoryListState.pageNo}`,
  () => $api.powerList({
    address: user!.userAddress,
    type: props.mode === 'team' ? '0' : '1',
    pageNumber: rewardsHistoryListState.pageNo.toString(),
    pageSize: 20,
  }, token),
  { watch: [rewardsHistoryListState], immediate: true, server: false },
);

useInfiniteScroll(
  document,
  (state) => {
    if (state.arrivedState.bottom) rewardsHistoryListState.pageNo++;
  },
  {
    canLoadMore: () => {
      // if (rewardsHistoryList.value.length === 0 && rewardsHistoryListState.pageNo === 1) return false;
      if (rewardsStatus.value !== 'success') return false;
      return rewardsData?.value?.totalPage !== undefined
        ? rewardsHistoryListState.pageNo < rewardsData?.value!.totalPage
        : true;
      // return false;
    },
  },
);
</script>

<template>
  <div class="card flex flex-col my-[28px] w-full p-[30px]">
    <div class="flex justify-between">
      <h3 class="text-white text-[24px]">
        {{ t('rewardsHistory') }}
      </h3>
      <div class="flex items-center space-x-[8px]">
        <UTooltip
          :popper="{ placement: 'top', arrow: true }"
          :ui="{
            width: 'max-w-max',
            rounded: 'rounded-[8px]',
            base: 'h-auto py-[16px] ps-[32px] pe-[16px]',
            background: 'bg-white dark:bg-white',
            arrow: { background: 'before:bg-white before:dark:bg-white' },
            ring: 'ring-0',
          }"
        >
          <template #text>
            <ul class="list-disc space-y-[10px]">
              <li class="text-[#666] text-[16px]">
                <div class="flex justify-between">
                  <span>{{ t('unlockRewardsCondition1') }}</span>
                  <NuxtImg
                    v-if="Number(user?.oneselfStakingAmount ?? 0) >= 500"
                    src="images/icon_checkmark_circle_green.png"
                  />
                  <NuxtImg
                    v-else
                    src="images/icon_xmark_circle_red.png"
                  />
                </div>
              </li>
              <li class="justify-between text-[#666] text-[16px]">
                <div class="flex justify-between">
                  <span class="me-[16px]">{{ t('unlockRewardsCondition2') }}</span>
                  <NuxtImg src="images/icon_xmark_circle_red.png" />
                </div>
              </li>
            </ul>
          </template>
          <NuxtImg
            src="images/icon_questionmmark_circle_grey.png"
            densities="1x 2x"
            height="14"
            width="14"
          />
        </UTooltip>
        <p class="text-[#999] text-[14px]">
          {{ t('howToUnlockTheRewards') }}
        </p>
      </div>
    </div>
    <div class="mt-[28px] flex text-center text-[#999] text-[16px] mb-2">
      <p>{{ mode === 'team' ? t('rank') : t('agency') }}</p>
      <p class="grow">
        {{ t('time') }}
      </p>
      <p class="grow">
        {{ t('power') }}
      </p>
      <p class="grow">
        {{ t('reward') }}
      </p>
    </div>
    <div class="flex flex-col divide-[#2E2E2E] divide-y">
      <div
        v-for="(item, index) in rewardsHistoryList"
        :key="index"
        class="flex justify-between items-center py-[20px]"
      >
        <div class="flex space-x-[16px] items-center">
          <UAvatar
            size="md"
            :text="item.rank"
            :ui="{ background: 'dark:bg-white', text: 'dark:text-[#333]' }"
          />
          <p>{{ item.businDateStr }}</p>
        </div>
        <p>{{ item.power }} BTP</p>
        <div class="flex space-x-[8px] items-center">
          <p class="text-primary-500">
            + {{ Number(item.reward).toLocaleString(undefined, { minimumFractionDigits: 2 }) }} BOOL
          </p>
          <UButton
            color="black"
            class="px-[8px] py-[6px] text-[16px] text-[#333] rounded-[4px]"
          >
            {{ t('claim') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
