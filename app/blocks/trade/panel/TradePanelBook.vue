<script setup lang="ts">
import { formatAmount } from '#imports';

const tradeStore = useTradeStore();
const { replace, currentRoute } = useRouter();
const { $api } = useNuxtApp();
const { currantToken } = storeToRefs(tradeStore);
const columns = computed(() => {
  const token0 = currantToken.value.tokens[0];
  const token1 = currantToken.value.tokens[1];
  return [
    {
      value: 'price',
      label: `Price(${token1?.symbol ?? '-'})`,
    },
    {
      value: 'qty',
      label: `Qty(${token0?.symbol ?? '-'})`,
    },
    {
      value: 'value',
      label: `Value(${token1?.symbol ?? '-'})`,
    },
  ];
});

const { counter } = useInterval(10000, { controls: true });
const { data } = useAsyncData(
  'order-book',
  () => {
    return $api.blockchainOrderBooks({});
  },
  {
    watch: [counter],
  },
);

const onSelectPrice = (price: string) => {
  replace({ query: { ...(currentRoute.value.query ?? {}), price } });
};
</script>

<template>
  <div class="h-[550px] flex flex-col">
    <div class="grid grid-cols-3">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] text-sm leading-base text-center text-nowrap first:text-start last:text-end"
      >
        {{ column.label }}
      </div>
    </div>
    <template v-if="data">
      <div class="grow mt-3.5 flex flex-col justify-end">
        <div
          v-for="item in data.orderSellBList"
          :key="JSON.stringify(item)"
          class="grid py-2.5 grid-cols-3 text-[14px] text-start cursor-pointer hover:bg-gray-50/10"
          @click="onSelectPrice(item.price)"
        >
          <span class="text-sell">{{ formatAmount(item.price, 5) }}</span>
          <span class="text-center"> {{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>

      <div class="my-5 flex items-end">
        <span class="text-[20px] me-3">
          {{ formatAmount(data.latestPrice, 5) }}
        </span>
        <span class="text-[14px] text-[#999]">
          ≈ {{ formatAmount(data.latestPrice, 2) }} USD
        </span>
      </div>

      <div class="grow">
        <div
          v-for="item in data.orderBuyBList"
          :key="JSON.stringify(item)"
          class="grid py-2.5 grid-cols-3 text-[14px] text-start cursor-pointer hover:bg-gray-50/10"
          @click="onSelectPrice(item.price)"
        >
          <span class="text-buy">{{ formatAmount(item.price, 5) }}</span>
          <span class="text-center"> {{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
