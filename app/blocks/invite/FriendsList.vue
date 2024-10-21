<script setup lang="ts">
import { shortAddress } from '~/utils/helpers';
import type { UserInviterRebates } from '~/types/swagger';

const { t } = useI18n();
const { $api } = useNuxtApp();

type FriendsListItem = UserInviterRebates['items'][0];

const selectedTierTab = ref<'LEVEL_1' | 'LEVEL_2'>('LEVEL_1');
const pageNo = ref(1);

const { token, user } = storeToRefs(useUserStore());

const friendsList = ref<FriendsListItem[]>([]);

const userCollectableRewardsAmount = computed(() => (
  Number(user.value?.rebateBalanceMap?.INVITER_L1 ?? 0)
  + Number(user.value?.rebateBalanceMap?.INVITER_L2 ?? 0)));

const { data, status, refresh } = useAsyncData(
  `inviteFriends-${pageNo.value}`,
  () => {
    if (!token.value) return Promise.resolve(undefined);
    return $api.userInviterRebates({
      pageNo: pageNo.value,
      pageSize: 10,
      type: selectedTierTab.value,
    }, token.value);
  },
  { server: false, watch: [pageNo, selectedTierTab, token] },
);

watch(data, () => {
  if (data.value?.items) {
    friendsList.value = [...friendsList.value, ...data.value.items];
  }
});

useInfiniteScroll(
  document,
  (state) => {
    if (state.arrivedState.bottom) pageNo.value++;
  },
  {
    canLoadMore: () => {
      if (friendsList.value.length === 0 && pageNo.value === 1) return false;
      if (status.value !== 'success') return false;
      return data.value?.totalPage !== undefined
        ? pageNo.value < data.value.totalPage
        : true;
    },
  },
);

const collecting = ref<boolean>(false);

async function onCollect() {
  collecting.value = true;
  $api
    .userRebateWithdrawPost({ withdrawType: selectedTierTab.value }, token.value)
    .then(() => {
      if (pageNo.value !== 1) {
        pageNo.value = 1;
      }
      else {
        refresh();
      }
    })
    .finally(() => {
      collecting.value = false;
    });
}
</script>

<template>
  <div class="card w-full flex flex-col items-center p-[30px]">
    <div class="w-full flex justify-between">
      <h3 class="text-white text-[24px]">
        {{ t('friendsList') }}
      </h3>
      <div class="flex items-center space-x-[8px]">
        <UTooltip
          :popper="{ placement: 'top', arrow: true }"
          :ui="{
            width: 'max-w-max',
            rounded: 'rounded-[8px]',
            base: 'h-auto py-[16px] ps-[16px] pe-[16px]',
            background: 'bg-white dark:bg-white',
            arrow: { background: 'before:bg-white before:dark:bg-white' },
            ring: 'ring-0',
          }"
        >
          <template #text>
            <div class="flex justify-between text-[#666] text-[16px] space-x-[16px]">
              <span>{{ t('unlockRewardsCondition1') }}</span>
              <NuxtImg
                :src="`images/icon_${user?.computeTag ? 'checkmark_circle_green' : 'xmark_circle_red'}.png`"
                densities="1x 2x"
                height="16"
                width="16"
              />
            </div>
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
    <div class="mt-[20px] w-full flex justify-between items-center">
      <div class="flex space-x-[8px]">
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="{ 'border-transparent text-[#999]': selectedTierTab !== 'LEVEL_1' }"
          @click="selectedTierTab = 'LEVEL_1'"
        >
          {{ t('tierOne') }}
        </button>
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="{ 'border-transparent text-[#999]': selectedTierTab !== 'LEVEL_2' }"
          @click="selectedTierTab = 'LEVEL_2'"
        >
          {{ t('tierTwo') }}
        </button>
      </div>
      <div class="flex space-x-[8px] items-center">
        <USkeleton
          v-if="!data"
          class="h-[24px] w-[48px]"
        />
        <p v-else>
          {{ t('collectableRewards') }}:
          {{ userCollectableRewardsAmount.toLocaleString() }} BOOL
        </p>
        <UButton
          color="black"
          class="px-[8px] py-[6px] text-[16px] rounded-[4px]"
          :disabled="userCollectableRewardsAmount <= 0 || status === 'pending'"
          :loading="collecting"
          @click="onCollect"
        >
          {{ t('collect') }}
        </UButton>
      </div>
    </div>
    <div
      v-if="(data?.items.length ?? 0) > 0"
      class="flex flex-col divide-[#2E2E2E] divide-y"
    >
      <div
        v-for="item in data?.items"
        :key="item.inviteeAddress"
        class="flex justify-between items-center py-[20px]"
      >
        <div class="flex space-x-[16px] items-center">
          <UAvatar
            size="md"
            :text="shortAddress(item.inviteeAddress)"
            :ui="{ background: 'dark:bg-white', text: 'dark:text-[#333]' }"
          />
        </div>
        <p class="text-primary-500">
          + {{ item.totalRebateAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }} BOOL
        </p>
      </div>
    </div>
    <div
      v-else-if="status === 'pending'"
      class="my-[50px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6"
        name="quill:loading-spin"
      />
    </div>
    <NuxtPicture
      v-else
      class="my-[50px]"
      src="images/empty_box.png"
      densities="1x 2x"
      height="68"
      width="80"
    />
  </div>
</template>
