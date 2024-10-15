<script setup lang="ts">
const { t } = useI18n();
// const { $api } = useNuxtApp();

defineProps<{ mode: 'team' | 'self' }>();

const rewardsHistoryListState = reactive<{
  pageNo: number;
}>({
  pageNo: 1,
});

const rewardsHistoryList = ref([
  { id: 1, rank: 34, time: '2024/10/28', power: 2390, reward: 105 },
  { id: 2, rank: 31, time: '2024/10/27', power: 2390, reward: 105 },
  { id: 3, rank: 80, time: '2024/10/26', power: 2330, reward: 90 },
  { id: 4, rank: 81, time: '2024/10/25', power: 2330, reward: 90 },
  { id: 5, rank: 81, time: '2024/10/24', power: 2330, reward: 90 },
  { id: 6, rank: 80, time: '2024/10/23', power: 2330, reward: 90 },
]);

// const { data: rewardsData, status: rewardsStatus } = useAsyncData(
//   `rewards-history-${rewardsHistoryListState.pageNo}`,
//   () => $api.userRewardsHistory({
//     pageNo: rewardsHistoryListState.pageNo,
//     pageSize: 20,
//   }),
//   { watch: [rewardsHistoryListState], immediate: true, server: false },
// );

useInfiniteScroll(
  document,
  (state) => {
    // if (state.arrivedState.bottom) rewardsHistoryListState.pageNo++;
    if (state.arrivedState.bottom) rewardsHistoryList.value = rewardsHistoryList.value.concat([
      { id: 1, rank: 34, time: '2024/10/28', power: 2390, reward: 105 },
      { id: 2, rank: 31, time: '2024/10/27', power: 2390, reward: 105 },
      { id: 3, rank: 80, time: '2024/10/26', power: 2330, reward: 90 },
      { id: 4, rank: 81, time: '2024/10/25', power: 2330, reward: 90 },
      { id: 5, rank: 81, time: '2024/10/24', power: 2330, reward: 90 },
      { id: 6, rank: 80, time: '2024/10/23', power: 2330, reward: 90 },
    ]);
  },
  {
    canLoadMore: () => {
      if (rewardsHistoryList.value.length === 0 && rewardsHistoryListState.pageNo === 1) return false;
      // if (rewardsStatus.value !== 'success') return false;
      // return rewardsData?.value?.pages !== undefined
      //   ? rewardsHistoryListState.pageNo < rewardsData?.value!.pages
      //   : true;
      return false;
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
                  <NuxtImg src="images/icon_checkmark_circle_green.png" />
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
        v-for="item in rewardsHistoryList"
        :key="item.id"
        class="flex justify-between items-center py-[20px]"
      >
        <div class="flex space-x-[16px] items-center">
          <UAvatar
            size="md"
            :text="item.rank.toString()"
            :ui="{ background: 'dark:bg-white', text: 'dark:text-[#333]' }"
          />
          <p>{{ item.time }}</p>
        </div>
        <p>{{ item.power }} BTP</p>
        <div class="flex space-x-[8px] items-center">
          <p class="text-primary-500">
            + {{ item.reward.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} BOOL
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
