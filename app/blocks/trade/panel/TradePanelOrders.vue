<script setup lang="ts">
const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);

const { $api } = useNuxtApp();
const { counter } = useInterval(10000, { controls: true });

const queryParams = ref({
  pageNo: 1,
  pageSize: 100,
});
const { data } = useAsyncData(
  `trade-orders`,
  () => {
    return $api.blockchainTradeHistory({
      ...queryParams.value,
      pair: currantToken.value.value,
    });
  },
  {
    watch: [queryParams, currantToken, counter],
    immediate: true,
    deep: true,
    server: false,
  },
);

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
      value: 'time',
      label: 'Time',
    },
  ];
});
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

    <div class="grow space-y-2.5 mt-3.5 scrollbar">
      <div
        v-for="(item, i) in data?.items ?? []"
        :key="i"
        class="grid grid-cols-3 text-[14px] text-start"
      >
        <span :class="item.type === 0 ? 'text-sell' : 'text-buy'">
          {{ item.price }}
        </span>
        <span class="text-center">{{ item.qty }}</span>
        <span class="text-end">{{ formatDate(Number(item.tradeTime), 'HH:mm:ss') }}</span>
      </div>
    </div>
  </div>
</template>
