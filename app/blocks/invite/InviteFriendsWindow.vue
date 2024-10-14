<script setup lang="ts">
const { t } = useI18n();
const { $api } = useNuxtApp();

const selectedTierTab = ref<'LEVEL_1' | 'LEVEL_2'>('LEVEL_1');
const pageNo = ref(1);

const { token } = useUserStore();

const { data, status } = useAsyncData(
  `inviteFriends-${pageNo.value}`,
  () => $api.userInviterRebates({ pageNo: pageNo.value, pageSize: 10, type: selectedTierTab.value }, token),
  { server: false, watch: [pageNo, selectedTierTab], lazy: true },
);

function collectBtnOnTap() {

}
</script>

<template>
  <div class="window w-full flex flex-col items-center p-[30px]">
    <div class="w-full flex justify-between">
      <h3 class="text-white text-[24px]">
        {{ t('friendsList') }}
      </h3>
      <div class="flex items-center space-x-[8px]">
        <NuxtImg
          src="images/icon_questionmmark_circle_grey.png"
          densities="1x 2x"
          height="14"
          width="14"
        />
        <p class="text-[#999] text-[14px]">
          {{ t('howToUnlockTheRewards') }}
        </p>
      </div>
    </div>
    <div class="mt-[20px] w-full flex justify-between items-center">
      <div class="flex space-x-[8px]">
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="selectedTierTab === 'LEVEL_1' ? '' : 'border-transparent text-[#999]'"
          @click="selectedTierTab = 'LEVEL_1'"
        >
          {{ t('tierOne') }}
        </button>
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="selectedTierTab === 'LEVEL_2' ? '' : 'border-transparent text-[#999]'"
          @click="selectedTierTab = 'LEVEL_2'"
        >
          {{ t('tierTwo') }}
        </button>
      </div>
      <div class="flex space-x-[8px] items-center">
        <p>{{ t('collectableRewards') }}: 466.14 BOOL</p>
        <UButton
          color="black"
          class="px-[8px] py-[6px]"
          @click="collectBtnOnTap"
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

<style scoped lang="postcss">
.window {
  border-radius: 12px;
  border: 1px solid white;
  background-color: black;
  box-shadow: 4px 4px 0 0 white;
  overflow: hidden;
}
</style>
