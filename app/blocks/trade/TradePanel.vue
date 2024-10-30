<script setup lang="ts">
const { t } = useI18n();

// const tabs = [
//   {
//     value: 'charts',
//     label: t('charts'),
//   },
//   {
//     value: 'trade',
//     label: t('trade'),
//   },
// ];
// const selected = ref('charts');

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
const { data } = useNuxtData('order-book');
</script>

<template>
  <div class="w-full flex flex-col">
    <!-- <div class="flex justify-start mb-[20px]"> -->
    <!--   <div -->
    <!--     v-for="item in tabs" -->
    <!--     :key="item.value" -->
    <!--     class="relative text-[#999] py-[8px] px-[20px] hover:text-white text-[24px] cursor-pointer rounded-full" -->
    <!--     :class="{ 'text-white border border-white': selected === item.value }" -->
    <!--     @click="() => selected = item.value" -->
    <!--   > -->
    <!--     {{ item.label }} -->
    <!--   </div> -->
    <!-- </div> -->
    <div class="card w-full py-10 px-8">
      <div class="flex items-center mb-[20px]">
        <div class="flex items-center space-x-[8px]">
          <USkeleton
            v-if="!data"
            class="w-[120px] h-[40px]"
          />
          <span
            v-else
            class="text-[48px]"
          >{{ data?.latestPrice }}</span>
          <span
            class="text-[16px] bg-buy-600 text-buy rounded-full h-[32px] text-center flex items-center px-[8px]"
          >
            +0.00%
          </span>
        </div>
        <!-- <UButton -->
        <!--   color="white" -->
        <!--   class="h-[44px]" -->
        <!--   :ui="{ rounded: 'rounded-[8px]' }" -->
        <!-- > -->
        <!--   Trade BOOL -->
        <!-- </UButton> -->
      </div>
      <div class="flex md:flex-row flex-col gap-8">
        <TradePanelForm class="md:w-1/2 w-full" />
        <div class="flex flex-col md:w-1/2 w-full">
          <div
            class="flex justify-start space-x-[30px] mb-2.5 border-b border-[#2e2e2e]"
          >
            <div
              v-for="item in orderTypes"
              :key="item.value"
              class="relative text-[#999] hover:text-white text-[16px] pb-[10px] cursor-pointer"
              :class="{
                'text-white selected after:bg-white':
                  selectedOrderType === item.value,
              }"
              @click="() => (selectedOrderType = item.value)"
            >
              {{ item.label }}
            </div>
          </div>
          <TradePanelOrders v-if="selectedOrderType === 'latestTrades'" />
          <TradePanelBook v-else-if="selectedOrderType === 'orderBook'" />
        </div>
      </div>
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
