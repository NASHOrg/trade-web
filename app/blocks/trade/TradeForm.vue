<script lang="ts" setup>
const { t } = useI18n();
const activeTab = ref<'limit' | 'market'>('limit');
const { isXL } = useDevice();

// const tabs = computed<{ value: 'limit' | 'market'; label: string }[]>(() => {
//   return [
//     {
//       value: 'limit',
//       label: t('Limit'),
//     },
//     {
//       value: 'market',
//       label: t('market'),
//     },
//   ];
// });

const selectedMode = ref('buy');
const tradeFormModes = computed(() => {
  return [
    { value: 'buy', label: t('buy') },
    { value: 'sell', label: t('sell') },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col lg:px-4 md:px-2 md:pt-4 pt-2">
    <!-- <div
      class="flex justify-start space-x-[30px] md:border-b-[1px] border-[#2E2E2E] md:mb-4"
    >
      <div
        v-for="item in tabs"
        :key="item.value"
        class="py-2.5 relative text-[#999] hover:text-white text-sm leading-4 font-normal cursor-pointer"
        :class="{
          'text-white selected after:bg-white': activeTab === item.value,
        }"
        @click="() => (activeTab = item.value)"
      >
        {{ item.label }}
      </div>
    </div> -->

    <div
      v-if="!isXL"
      class="form-item mb-[14px] mt-[4px] w-full flex items-center overflow-hidden"
    >
      <span
        v-for="item in tradeFormModes"
        :key="item.value"
        class="relative cursor-pointer w-full flex justify-center items-center h-full"
        :class="{ 'text-white': selectedMode === item.value, 'bg-sell': (selectedMode === 'sell' && item.value === 'sell'), 'bg-buy': (selectedMode === 'buy' && item.value === 'buy') }"
        @click="selectedMode = item.value"
      >
        <span class="z-[5]">{{ item.label }}</span>
        <IconBuyArraw
          v-if="item.value === 'buy' && selectedMode === 'buy'"
          class="absolute -end-4"
        />
        <IconSellArraw
          v-if="item.value === 'sell' && selectedMode === 'sell'"
          class="absolute -start-4"
        />
      </span>
    </div>

    <div
      v-if="isXL"
      class="w-full grow flex space-x-8 pb-6"
    >
      <TradePanelBuyForm :mode="activeTab" />
      <TradePanelSellForm :mode="activeTab" />
    </div>
    <div v-else>
      <TradePanelBuyForm
        v-if="selectedMode === 'buy'"
        :mode="activeTab"
      />
      <TradePanelSellForm
        v-else-if="selectedMode === 'sell'"
        :mode="activeTab"
      />
    </div>
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[38px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
