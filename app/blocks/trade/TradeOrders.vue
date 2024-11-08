<script lang="ts" setup>
const { t } = useI18n();
const { isXL, isMD } = useDevice();
const selectedOrderType = ref('orderBook');

const orderTypes = computed(() => {
  return [
    {
      value: 'orderBook',
      label: isMD.value ? t('orderBook') : t('orders'),
    },
    {
      value: 'latestTrades',
      label: isMD.value ? t('latestTrades') : t('trades'),
    },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col select-none">
    <div
      class="xl:flex md:hidden flex justify-start md:space-x-[30px] space-x-2.5 md:border-b-[1px] border-[#2E2E2E] md:px-4 px-2"
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
    <div
      v-if="isXL || !isMD"
      class="w-full grow overflow-hidden"
    >
      <TradePanelOrders v-if="selectedOrderType === 'latestTrades'" />
      <TradePanelBook v-else-if="selectedOrderType === 'orderBook'" />
    </div>
    <div
      v-else
      class="w-full h-full overflow-hidden grid gap-2"
      style="grid-template-columns: 1fr auto 1fr"
    >
      <TradePanelBook />
      <div class="h-full w-[1px] bg-[#2E2E2E]" />
      <TradePanelOrders class="overflow-hidden" />
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
