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
    <div class="form-item text-[24px] relative">
      <span
        v-for="item in tabs"
        :key="item.value"
        class="z-10 cursor-pointer w-full flex justify-center"
        :class="{ 'text-white': selectedTab === item.value }"
        @click="selectedTab = item.value"
      >{{ item.label }}</span>
      <IconBuyArraw
        v-if="selectedTab === 'buy'"
        class="absolute start-0"
      />
      <IconSellArraw
        v-else
        class="absolute end-0"
      />
    </div>
    <TradePanelBuyForm v-if="selectedTab === 'buy'" />
    <TradePanelSellForm v-else />
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
