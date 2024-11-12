<script lang="ts" setup>
import { TokensSlideover } from '#components';

const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);
const range = ref<'hour' | 'day'>('hour');

const timePriceForToken = computed(() => {
  return [
    { id: '24H-hight', label: '24H Hight', value: '--' },
    { id: '24H-low', label: '24H Low', value: '--' },
    { id: '24H-vol', label: '24H Vol', value: '--' },
    { id: '24H-amt', label: '24H Amt', value: '--' },
  ];
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
        <span class="text-buy">--</span>
      </div>

      <div
        class="h-full flex md:flex-row flex-col items-center md:gap-6 gap-1 text-xs font-normal"
      >
        <div
          v-for="item in timePriceForToken"
          :key="item.id"
          class="w-full h-full flex md:flex-col flex-row md:justify-around justify-between"
        >
          <span class="text-[#999999]">{{ item.label }}</span>
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
