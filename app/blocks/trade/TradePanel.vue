<script setup lang="ts">
const { t } = useI18n();

const tabs = [
  {
    value: 'charts',
    label: t('charts'),
  },
  {
    value: 'trade',
    label: t('trade'),
  },
];
const selected = ref('charts');

const orderTypes = [
  {
    value: 'orderBook',
    label: t('orderBook'),
  },
  {
    value: 'latestTrades',
    label: t('latestTrades'),
  },
];
const selectedOrderType = ref('orderBook');
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex justify-start mb-[20px]">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="relative text-[#999] py-[8px] px-[20px] hover:text-white text-[24px] cursor-pointer rounded-full"
        :class="{ 'text-white border border-white': selected === item.value }"
        @click="() => selected = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="card w-full p-[40px]">
      <div class="flex justify-between mb-[20px]">
        <span class="text-[48px]">0.45468</span>
        <UButton
          color="black"
          class="h-[44px]"
          :ui="{ rounded: 'rounded-[8px]' }"
        >
          Trade BOOL
        </UButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        <TradePanelForm />
        <div class="flex flex-col">
          <div class="flex justify-start space-x-[30px] mb-[20px] border-b border-[#2e2e2e]">
            <div
              v-for="item in orderTypes"
              :key="item.value"
              class="relative text-[#999] hover:text-white text-[16px] pb-[10px] cursor-pointer"
              :class="{ 'text-white selected after:bg-white': selectedOrderType === item.value }"
              @click="() => selectedOrderType = item.value"
            >
              {{ item.label }}
            </div>
          </div>
          <TradePanelOrders v-show="selectedOrderType === 'latestTrades'" />
          <TradePanelBook v-show="selectedOrderType === 'orderBook'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
