<script lang="ts" setup>
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';
import { TokensSlideover } from '#components';

const mainChart = ref<null | IChartApi>();
const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);
const { $api } = useNuxtApp();

const mainChartContainer = ref<null | HTMLElement>();
const candlestickSeries = ref<null | ISeriesApi<'Candlestick'>>();
const tooltipData = ref<{
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
} | undefined>();

const timeSpecified = ref('0');

const charting = ref(true);
const { counter } = useInterval(3000, { controls: true });

const { data, status } = useAsyncData(
  generateRandomNumber(),
  () => $api.blockchainTradeStatistic({ type: timeSpecified.value }),
  {
    server: false,
    watch: [timeSpecified],
  },
);

const { data: newData } = useAsyncData(
  generateRandomNumber(),
  () => {
    if (!data.value) return Promise.resolve(null);
    return $api.blockchainTradeStatistic({
      type: timeSpecified.value,
    });
  },
  {
    server: false,
    watch: [counter],
  },
);

const timePriceForToken = computed(() => {
  return [
    { id: '24H-hight', label: '24H Hight', value: '--' },
    { id: '24H-low', label: '24H Low', value: '--' },
    { id: '24H-vol', label: '24H Vol', value: '--' },
    { id: '24H-amt', label: '24H Amt', value: '--' },
  ];
});

const timeSpecifiedTrade = computed(() => {
  return [
    { id: '0', label: '1hour' },
    { id: '1', label: '1day' },
    // { id: "2", label: "1month" },
  ];
});

const tradeData = computed(() => {
  const list = (data.value?.items ?? [])
    .map((item) => {
      return {
        time: Number(item.time) / 1000,
        open: Number(item.openPrice),
        high: Number(item.highPrice),
        low: Number(item.lowPrice),
        close: Number(item.closePrice),
      };
    })
    .reverse();

  if (list.length > 0) {
    const test = (timeSpecified.value === '0' ? hourData : dayData);
    return [...test, ...list].map(t => ({
      ...t, time: timeToLocal(t.time), close: t.open, open: t.close,
    }));
  }

  return list;
});

const maxVisibleBars = 50;
function changeChartRange() {
  const visibleLogicalRange = mainChart
    .value!.timeScale()
    .getVisibleLogicalRange();
  if (!visibleLogicalRange) return;

  const barsVisible = visibleLogicalRange.to - visibleLogicalRange.from;
  if (barsVisible < maxVisibleBars) {
    // 设置可见范围，使其最小显示 maxVisibleBars 个数据点
    const center = (visibleLogicalRange.to + visibleLogicalRange.from) / 2;
    mainChart.value!.timeScale().setVisibleLogicalRange({
      from: center - maxVisibleBars / 2,
      to: center + maxVisibleBars / 2,
    });
  }
}

function setTooltip() {
  if (!mainChartContainer.value || !mainChart.value) return;
  const allData = candlestickSeries.value!.data();
  const data = allData[allData.length - 1];
  tooltipData.value = data as any;

  // update tooltip
  mainChart.value.subscribeCrosshairMove((param) => {
    const allData = candlestickSeries.value!.data();
    const data = param.time ? allData.find(t => t.time === param.time)! : allData[allData.length - 1]!;
    tooltipData.value = data as any;
  });
}

function initChart() {
  if (!mainChart.value) {
    charting.value = true;
  }
  if (!mainChart.value) {
    mainChart.value = createChart(mainChartContainer.value!, {
      grid: {
        vertLines: {
          color: '#2E2E2E',
        },
        horzLines: {
          color: '#2e2e2e',
        },
      },
      layout: {
        textColor: '#999999',
        background: { color: '#121212' },
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        secondsVisible: true,
      },
    });
  }

  if (!candlestickSeries.value) {
    candlestickSeries.value = mainChart.value.addCandlestickSeries({
      upColor: '#0AC49E',
      downColor: '#E24444',
      borderVisible: false,
      wickUpColor: '#0AC49E',
      wickDownColor: '#E24444',
      priceLineColor: '#E24444',
      priceScaleId: 'right', // 使用右侧价格刻度
      priceLineVisible: false,
    });
  }

  candlestickSeries.value.setData(tradeData.value as any);
  setTooltip();
  candlestickSeries.value.priceScale().applyOptions({
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  });

  mainChart.value.timeScale().subscribeVisibleTimeRangeChange(changeChartRange);

  // setTooltip(candlestickSeries);
  mainChart.value.timeScale().fitContent();
  setTimeout(() => {
    mainChart.value!.timeScale().setVisibleLogicalRange({
      from:
        tradeData.value.length > maxVisibleBars
          ? tradeData.value.length - 1 - maxVisibleBars
          : 0,
      to: tradeData.value.length - 1,
    });
    // changeChartRange();
    charting.value = false;
  }, 200);
}

function updateChart() {
  if (!candlestickSeries.value) {
    return;
  }
  const item = newData.value?.items?.[0];

  if (item) {
    const data = {
      time: timeToLocal(Number(item.time) / 1000) as Time,
      open: Number(item.openPrice),
      high: Number(item.highPrice),
      low: Number(item.lowPrice),
      close: Number(item.closePrice),
    };
    candlestickSeries.value.update(data);
    if (tooltipData.value?.time === data.time) {
      tooltipData.value = data as any;
    }
  }
}

watch(newData, () => {
  updateChart();
});

watch(
  status,
  () => {
    if (status.value !== 'pending') {
      initChart();
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const slideover = useSlideover();
function openTokens() {
  slideover.open(TokensSlideover);
}

let oldRect: DOMRect | undefined = undefined;
async function resizeHandler() {
  if (charting.value) {
    return;
  }
  // throttle
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
  const rect = mainChartContainer.value?.getBoundingClientRect?.();

  if (mainChart.value && rect) {
    const widthRangeUp = rect.width + 30;
    const widthRangeLow = rect.width - 30;

    if (
      !oldRect
      || oldRect.width > widthRangeUp
      || oldRect.width < widthRangeLow
    ) {
      charting.value = true;
      oldRect = rect;

      mainChart.value.resize(rect.width, rect.height);
    }
  }
  charting.value = false;
}

onMounted(() => {
  oldRect = mainChartContainer.value?.getBoundingClientRect();
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
});
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
        :class="{ ' text-white': timeSpecified === item.id }"
        @click="timeSpecified = item.id"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="grow md:h-auto h-[200px] relative">
      <ClientOnly>
        <div
          ref="mainChartContainer"
          class="w-full h-full relative"
        />
        <div
          v-if="(tradeData.length === 0 && status === 'pending') || charting"
          class="absolute top-0 left-0 w-full h-full bg-[#121212] z-10 flex justify-center items-center"
        >
          <UIcon
            class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
            name="quill:loading-spin"
          />
        </div>
      </ClientOnly>
      <ChartTooltip
        v-if="tooltipData"
        class="absolute left-1 top-1 z-10"
        :data="tooltipData"
      />
    </div>
  </div>
</template>
