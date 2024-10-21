<script setup lang="ts">
const tabs = [
  {
    value: 'buy',
    label: 'Buy',
  },
  {
    value: 'sell',
    label: 'Sell',
  },
];
const selectedTab = ref('buy');
</script>

<template>
  <div class="w-full flex flex-col space-y-[16px]">
    <div class="form-item text-[24px] !p-0 overflow-hidden space-x-[20px]">
      <span
        v-for="item in tabs"
        :key="item.value"
        class="relative cursor-pointer w-full flex justify-center items-center h-full"
        :class="{ 'text-white': selectedTab === item.value, 'bg-sell': (selectedTab === 'sell' && item.value === 'sell'), 'bg-buy': (selectedTab === 'buy' && item.value === 'buy') }"
        @click="selectedTab = item.value"
      >
        <span class="z-[5]">{{ item.label }}</span>
        <IconBuyArraw
          v-if="item.value === 'buy' && selectedTab === 'buy'"
          class="absolute -end-4"
        />
        <IconSellArraw
          v-if="item.value === 'sell' && selectedTab === 'sell'"
          class="absolute -start-4"
        />
      </span>
    </div>
    <TradePanelBuyForm v-if="selectedTab === 'buy'" />
    <TradePanelSellForm v-else />
    <div class="flex justify-center items-center mt-[8px] space-x-[8px] text-[#999] text-[14px]">
      <UPopover
        :popper="{ placement: 'top' }"
        mode="hover"
      >
        <IconHelp />
        <template #panel>
          <div class="flex flex-col p-2 text-[12px] space-y-[8px]">
            <span>{{ $t('tradingFeeRate') }}</span>
            <span>{{ $t('maker') }}: 0.00%</span>
            <span>{{ $t('taker') }}: 0.30%</span>
          </div>
        </template>
      </UPopover>
      <span>{{ $t('tradingFee') }}</span>
    </div>
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
