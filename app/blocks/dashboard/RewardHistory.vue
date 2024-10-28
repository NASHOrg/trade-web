<script setup lang="ts">
import type { PowerList } from '~/types/swagger';
import { formatAmount } from '~/utils/helpers';

const { t } = useI18n();
const { $api } = useNuxtApp();
const { user, token } = useUserStore();

const props = defineProps<{ mode: 'team' | 'self' }>();

const pageNo = ref<number>(1);

type PowerListItem = PowerList['items'][0];

const rewardsHistoryList = ref<PowerListItem[]>([]);

const { data: rewardsData, status: rewardsStatus } = useAsyncData(
  `rewards-history-${pageNo.value}`,
  () => {
    if (!token) return Promise.resolve(undefined);
    return $api.powerList({
      address: user!.userAddress,
      // address: '0x56d9dfc0ce2e16a9cc9c0c04829df2de03f458a6',
      type: props.mode === 'team' ? '0' : '1',
      pageNumber: pageNo.value.toString(),
      pageSize: 20,
    }, token);
  },
  { watch: [pageNo, props], immediate: true, server: false },
);

watch(rewardsData, () => {
  if (rewardsData?.value?.items) {
    rewardsHistoryList.value = [...rewardsHistoryList.value, ...rewardsData.value.items];
  }
});

useInfiniteScroll(
  document,
  (state) => {
    if (state.arrivedState.bottom) pageNo.value++;
  },
  {
    canLoadMore: () => {
      if (rewardsHistoryList.value.length === 0 && pageNo.value === 1) return false;
      if (rewardsStatus.value !== 'success') return false;
      return rewardsData?.value?.totalPage !== undefined
        ? pageNo.value < rewardsData?.value!.totalPage
        : true;
      // return false;
    },
  },
);

const claiming = ref<number | undefined>(undefined);

function claimBtnOnTap(item: PowerListItem) {
  if (claiming.value !== undefined) return;
  claiming.value = item.businDate;
  $api
    .powerWithdrawPost({
      address: user!.userAddress,
      businDate: item.businDate,
      type: props.mode === 'team' ? 0 : 1,
    }, token)
    .then(() => {
      pageNo.value = 1;
    })
    .finally(() => {
      claiming.value = undefined;
    });
}

function formatDate(dateString: string) {
  if (dateString.length !== 8) {
    throw new Error('Invalid date string');
  }
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return `${year}/${month}/${day}`;
}
</script>

<template>
  <div class="card flex flex-col my-[28px] w-full p-[30px]">
    <div class="flex justify-between">
      <h3 class="text-white text-[24px]">
        {{ t('rewardsHistory') }}
      </h3>
      <div
        v-if="props.mode === 'team'"
        class="flex items-center space-x-[8px]"
      >
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
                  <!-- TODO: 补充条件所需的数据 -->
                  <NuxtImg
                    v-if="false"
                    src="images/icon_checkmark_circle_green.png"
                  />
                  <NuxtImg
                    v-else
                    src="images/icon_xmark_circle_red.png"
                  />
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
    <div
      v-if="(rewardsData?.items.length ?? 0) > 0"
      class="flex flex-col divide-[#2E2E2E] divide-y"
    >
      <div
        v-for="(item, index) in rewardsHistoryList"
        :key="index"
        class="flex justify-between items-center py-[20px]"
      >
        <div class="flex space-x-[16px] items-center">
          <UAvatar
            size="md"
            :text="item.rank.toString()"
            :ui="{ background: 'dark:bg-white', text: 'dark:text-[#333]' }"
          />
          <p>{{ formatDate(item.businDate.toString()) }}</p>
        </div>
        <p>{{ formatAmount(item.power, 2) }} {{ props.mode === 'team' ? 'BTP' : 'BPP' }}</p>
        <div class="flex space-x-[8px] items-center">
          <p class="text-primary-500">
            + {{ formatAmount(item.reward, 2) }} BOOL
          </p>
          <UButton
            color="black"
            class="px-[8px] py-[6px] text-[16px] text-[#333] rounded-[4px]"
            :disabled="item.claimed || Number(user?.oneselfStakingAmount ?? 0) < 500"
            :loading="claiming === item.businDate"
            @click="claimBtnOnTap(item)"
          >
            {{ t('claim') }}
          </UButton>
        </div>
      </div>
    </div>
    <div
      v-else-if="rewardsStatus === 'pending'"
      class="my-[50px] w-full h-[68px] flex justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6"
        name="quill:loading-spin"
      />
    </div>
    <NuxtPicture
      v-else
      class="my-[50px] flex justify-center"
      src="images/empty_box.png"
      densities="1x 2x"
      height="68"
      width="80"
    />
  </div>
</template>
