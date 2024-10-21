<script setup lang="ts">
const { $api } = useNuxtApp();
const columns = [
  {
    value: 'price',
    label: 'Price(USDT)',
  },
  {
    value: 'qty',
    label: 'Qty',
  },
  {
    value: 'value',
    label: 'Value(USDT)',
  },
];

const { counter } = useInterval(10000, { controls: true });
const { data } = useAsyncData('order-book', () => {
  return $api.blockchainOrderBooks({});
}, {
  watch: [counter],
});
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-3">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] text-[14px] text-center"
      >
        {{ column.label }}
      </div>
    </div>
    <template v-if="data">
      <div
        v-for="item in data.orderBuyBList"
        :key="JSON.stringify(item)"
      >
        <div class="grid grid-cols-[3fr,2fr,2fr] mt-[10px] text-[14px] first:mt-[14px] text-start">
          <span class="text-buy">{{ formatAmount(item.price, 5) }}</span>
          <span>{{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>
      <div class="my-[20px]">
        <span class="text-[20px] me-2">{{ formatAmount(data.latestPrice, 5) }}</span>
        <span class="text-[14px] text-[#999]">≈ {{ formatAmount(data.latestPrice, 2) }} USD</span>
      </div>
      <div
        v-for="item in data.orderSellBList"
        :key="JSON.stringify(item)"
      >
        <div class="grid grid-cols-[3fr,2fr,2fr] mt-[10px] text-[14px] text-start">
          <span class="text-sell">{{ formatAmount(item.price, 5) }}</span>
          <span>{{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
