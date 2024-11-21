<script lang="ts" setup>
import BN from 'bignumber.js';
import { useStorage } from '@vueuse/core';
import { TokensSlideover } from '#components';

const showChart = useStorage<boolean>('xbit-show-shart', false);
const { currentPair } = useNetworkConfig();
const { $api } = useNuxtApp();
const { isMD } = useDevice();
const range = ref<'hour' | 'day'>('hour');

const { data: tradeData } = useNuxtData('trade-statistic-hour');

const { counter, pause, reset } = useInterval(3000, { controls: true });

useAsyncData(
  `trade-statistic-hour`,
  () => {
    return $api.blockchainTradeStatistic({
      type: '0',
    });
  },
  {
    server: false,
    watch: [counter],
  },
);

watch(() => isMD || showChart, (value) => {
  if (value) {
    pause();
  }
  else {
    reset();
  }
});

const timePriceForToken = computed(() => {
  if (!tradeData.value) return;
  const items = tradeData.value.items as any[];
  if (items.length === 0) {
    return [
      { id: '24H-high', label: '24H High', value: '0' },
      { id: '24H-low', label: '24H Low', value: '0' },
      { id: '24H-vol', label: '24H Vol', value: '0' },

    ];
  }
  const high = BN.max(...items.slice(0, 24).map(item => BN(item.highPrice)));
  const low = BN.min(...items.slice(0, 24).map(item => BN(item.lowPrice)));
  const vol = items.slice(0, 24).reduce((acc, item) => acc.plus(BN(item.tradeAmount)), BN(0));
  return [
    { id: '24H-high', label: '24H High', value: formatAmount(high.toString(), 5, { endPad: true }) },
    { id: '24H-low', label: '24H Low', value: formatAmount(low.toString(), 5, { endPad: true }) },
    { id: '24H-vol', label: '24H Vol', value: vol.dp(2).toString() },
  ];
});

const priceChange = computed(() => {
  if (!tradeData.value) return 0;
  const items = tradeData.value.items as any[];
  if (items.length === 0) return '0';
  const dailyData = items.slice(0, 24);
  const close = dailyData[0]?.closePrice || '0';
  const open = dailyData[dailyData.length - 1].openPrice;
  const price = BN(close).minus(open).div(open).times(100).dp(2, 1).toString();
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
    <div class="flex items-center">
      <div
        class="w-full md:h-9 md:px-5 px-2.5 my-2 flex flex-col md:flex-row md:items-center items-start md:space-x-6"
      >
        <div
          class="h-full flex items-center md:space-x-2.5 space-x-1.5"
        >
          <div
            class="md:h-full flex items-center justify-center md:space-x-2.5 space-x-1.5 text-base font-bold cursor-pointer"
            @click="openTokens"
          >
            <span>{{ currentPair.label ?? "Token" }}</span>
            <UIcon name="i-mingcute-down-line" />
          </div>
          <span
            v-if="priceChange === undefined"
            class="text-buy"
          >--</span>
          <span
            v-else
            :class="priceChange >= 0 ? 'text-buy' : 'text-sell'"
          >{{ `${priceChange >= 0 ? '+' : ''}${priceChange}%` }}</span>
        </div>

        <div
          class="h-full flex items-center md:gap-6 gap-2 text-xs font-normal"
        >
          <div
            v-for="item in timePriceForToken"
            :key="item.id"
            class="w-fit md:w-full h-full flex md:flex-col flex-row md:justify-around justify-between space-x-1 md:space-x-0 items-center"
          >
            <span class="text-[#999999] text-nowrap">{{ item.label }}</span>
            <span class="text-white">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div
        class="block md:hidden me-1"
        @click="showChart = !showChart"
      >
        <IconChart class="text-[#2e2e2e] dark:text-white size-[24px]" />
      </div>
    </div>

    <div
      v-if="isMD || showChart"
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

    <div
      v-if="isMD || showChart"
      class="grow md:h-auto h-[300px] relative"
    >
      <TvChart
        :key="range"
        :range="range"
        class="ms-[10px] md:ms-0"
      />
    </div>
  </div>
</template>
