<script setup lang="ts">
const { currentPair } = useNetworkConfig();
const { $api } = useNuxtApp();
const appConfig = useAppConfig();
const { counter } = useInterval(appConfig.fetch.fast, { controls: true });
const { isMD } = useDevice();
const selectedPrice = useState('selected-price');

const queryParams = ref({
  pageNo: 1,
  pageSize: 100,
});
const { data } = useAsyncData(
  `trade-orders-${currentPair.value.value}`,
  () => {
    return $api.blockchainTradeHistory({
      ...queryParams.value,
      pair: currentPair.value?.value,
    });
  },
  {
    watch: [queryParams, () => currentPair.value.value, counter],
    immediate: true,
    deep: true,
    server: false,
  },
);

const columns = computed(() => {
  const token0 = currentPair.value?.tokens[0];
  const token1 = currentPair.value?.tokens[1];
  return [
    {
      value: 'price',
      label: `Price(${token1?.symbol ?? '-'})`,
    },
    {
      value: 'qty',
      label: `Qty(${token0?.symbol ?? '-'})`,
    },
    ...(isMD.value
      ? [
          {
            value: 'tradeTime',
            label: 'Time',
          },
        ]
      : []),
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="md:px-4 md:py-4 px-2 py-2 grid md:grid-cols-3 grid-cols-2">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] md:text-xs text-[10px] md:leading-[14px] leading-3 text-nowrap first:text-start text-end"
      >
        {{ column.label }}
      </div>
    </div>

    <div class="w-full grow xl:space-y-2.5 space-y-1 overflow-y-auto scrollbar">
      <div
        v-for="(item, i) in data?.items ?? []"
        :key="i"
        class="grid md:px-4 px-2 md:py-2.5 py-1 md:grid-cols-3 grid-cols-2 md:text-[14px] text-xs text-start cursor-pointer hover:bg-gray-50/10"
        @click="selectedPrice = item.price"
      >
        <span
          v-for="col in columns"
          :key="col.value"
          class="first:text-start text-end"
          :class="{ 'text-sell': item.type === 0, 'text-buy': item.type !== 0 }"
        >
          <template v-if="col.value !== 'tradeTime'">
            {{
              formatAmount(item[col.value], col.value === "price" ? 5 : 2, {
                endPad: true,
                format: true,
                rounded: col.value === 'qty',
              })
            }}
          </template>
          <template v-else>
            {{ formatDate(Number(item.tradeTime), "HH:mm:ss") }}
          </template>
        </span>
        <!-- <span :class="item.type === 0 ? 'text-sell' : 'text-buy'">
          {{ item.price }}
        </span>
        <span class="text-center">{{ formatAmount(item.qty, 5) }}</span>
        <span class="text-end">
          {{ formatDate(Number(item.tradeTime), "HH:mm:ss") }}
        </span> -->
      </div>
    </div>
  </div>
</template>
