<script lang="ts" setup>
import BN from 'bignumber.js';
import { TokensSlideover } from '#components';

const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);
const range = ref<'hour' | 'day'>('hour');

const { data: tradeData } = useNuxtData('trade-statistic-hour');

const timePriceForToken = computed(() => {
  if (!tradeData.value) return;
  const items = tradeData.value.items as any[];
  const high = BN.max(...items.slice(0, 24).map(item => BN(item.highPrice)));
  const low = BN.min(...items.slice(0, 24).map(item => BN(item.lowPrice)));
  const vol = items.slice(0, 24).reduce((acc, item) => acc.plus(BN(item.tradeAmount)), BN(0));
  return [
    { id: '24H-high', label: '24H High', value: high.dp(5, 1).toString() },
    { id: '24H-low', label: '24H Low', value: low.dp(5, 1).toString() },
    { id: '24H-vol', label: '24H Vol', value: vol.dp(2).toString() },
  ];
});

const priceChange = computed(() => {
  if (!tradeData.value) return 0;
  const items = tradeData.value.items as any[];
  const dailyData = items.slice(0, 24);
  const open = dailyData[0].openPrice;
  const close = dailyData[dailyData.length - 1].openPrice;
  const price = BN(open).minus(close).div(open).times(100).dp(2, 1).toString();
  return Number(price);
});

const timeSpecifiedTrade = [
  { id: 'hour', label: '1Hour' },
  { id: 'day', label: '1Day' },
  // { id: "2", label: "1month" },
] as const;

const slideover = useSlideover();
function openTokens() {
  slideover.open(TokensSlideover);
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="w-full md:h-9 md:px-5 px-2.5 my-2 md:flex grid grid-cols-2 items-center md:space-x-6"
    >
      <div
        class="h-full flex md:items-center items-start md:space-x-2.5 space-x-1.5"
      >
        <div
          class="md:h-full flex items-center justify-center md:space-x-2.5 space-x-1.5 text-base font-bold"
          @click="openTokens"
        >
          <span>{{ currantToken?.label ?? "Token" }}</span>
          <UIcon name="i-mingcute-down-line" />
        </div>
        <span
          v-if="priceChange === undefined"
          class="text-buy"
        >--</span>
        <span
          v-else
          :class="priceChange >= 0 ? 'text-buy' : 'text-sell'"
        >{{ `${priceChange > 0 ? '+' : ''}${priceChange}%` }}</span>
      </div>

      <div
        class="h-full flex md:flex-row flex-col items-center md:gap-6 gap-1 text-xs font-normal"
      >
        <div
          v-for="item in timePriceForToken"
          :key="item.id"
          class="w-full h-full flex md:flex-col flex-row md:justify-around justify-between"
        >
          <span class="text-[#999999] text-nowrap">{{ item.label }}</span>
          <span class="text-white">{{ item.value }}</span>
        </div>
      </div>
    </div>

    <div
      :class="
        [
          'w-full md:px-5 px-2.5 md:py-2.5 py-1.5 border-y-[1px] border-[#2E2E2E] md:text-sm text-xs font-normal leading-4 text-[#999999]',
          'flex space-x-5',
        ].join(' ')
      "
    >
      <span class="text-white">Time</span>
      <div
        v-for="item in timeSpecifiedTrade"
        :key="item.id"
        class="cursor-pointer"
        :class="{ ' text-white': range === item.id }"
        @click="range = item.id"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="grow md:h-auto h-[200px] relative">
      <TvChart
        :key="range"
        :range="range"
      />
    </div>
  </div>
</template>
