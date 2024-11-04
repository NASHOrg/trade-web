<script lang="ts" setup>
const { t } = useI18n();
const selectedOrderType = ref('orderBook');

const orderTypes = computed(() => {
  return [
    {
      value: 'orderBook',
      label: t('orderBook'),
    },
    {
      value: 'latestTrades',
      label: t('latestTrades'),
    },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col select-none">
    <div
      class="flex justify-start space-x-[30px] border-b-[1px] border-[#2E2E2E] px-4"
    >
      <div
        v-for="item in orderTypes"
        :key="item.value"
        class="py-2.5 relative text-[#999] hover:text-white text-sm leading-4 font-normal cursor-pointer"
        :class="{
          'text-white selected after:bg-white':
            selectedOrderType === item.value,
        }"
        @click="() => (selectedOrderType = item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="w-full grow overflow-hidden">
      <TradePanelOrders v-if="selectedOrderType === 'latestTrades'" />
      <TradePanelBook v-else-if="selectedOrderType === 'orderBook'" />
    </div>
  </div>
</template>

<style scoped>
.selected::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
