<script lang="ts" setup>
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';

const props = defineProps<{
  range: 'day' | 'hour';
}>();

const { $api } = useNuxtApp();

const inited = ref(false);
const mainChartContainer = ref<null | HTMLElement>();
let candlestickSeries: ISeriesApi<'Candlestick'> | undefined;
let histogramSeries: ISeriesApi<'Histogram'> | undefined;
let mainChart: IChartApi | undefined;

const tooltipData = ref<{
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
} | undefined>();

const { counter } = useInterval(3000, { controls: true });
const type = computed(() => props.range === 'day' ? '1' : '0');

const { data: newData } = useAsyncData(
  `trade-statistic-${props.range}`,
  () => {
    return $api.blockchainTradeStatistic({
      type: type.value,
    });
  },
  {
    server: false,
    watch: [counter],
  },
);

const maxVisibleBars = 200;
// function changeChartRange() {
//   const visibleLogicalRange = mainChart!.timeScale()
//     .getVisibleLogicalRange();
//   if (!visibleLogicalRange) return;
//   if (visibleLogicalRange.from <= -50) {
//     const newData = hourData.map(t => ({
//       ...t, time: timeToLocal(t.time), close: t.open, open: t.close,
//     }));
//     const existingData = candlestickSeries!.data();
//     candlestickSeries!.setData([...newData, ...existingData] as any);
//   }
// }

function setTooltip() {
  if (!mainChartContainer.value || !mainChart || !candlestickSeries) return;
  const allData = candlestickSeries.data();
  const data = allData[allData.length - 1];
  tooltipData.value = data as any;

  // update tooltip
  mainChart.subscribeCrosshairMove((param) => {
    const allData = candlestickSeries!.data();
    const data = param.time ? allData.find(t => t.time === param.time)! : allData[allData.length - 1]!;
    tooltipData.value = data as any;
  });
}

async function initChart() {
  const tradeData = await $api.blockchainTradeStatistic({ type: type.value });
  let list = (tradeData!.items ?? [])
    .map((item) => {
      return {
        time: Number(item.time) / 1000,
        open: Number(item.openPrice),
        high: Number(item.highPrice),
        low: Number(item.lowPrice),
        close: Number(item.closePrice),
        value: Number(item.tradeAmount),
      };
    })
    .reverse();

  if (list.length > 0) {
    const test = (type.value === '0' ? hourData : dayData);
    list = [...test, ...list].map(t => ({
      ...t, time: timeToLocal(t.time), close: t.open, open: t.close,
    } as any));
  }
  if (!mainChart) {
    mainChart = createChart(mainChartContainer.value!, {
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

  if (!histogramSeries) {
    histogramSeries = mainChart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      color: '#333' });
  }

  if (!candlestickSeries) {
    candlestickSeries = mainChart.addCandlestickSeries({
      upColor: '#0AC49ECC',
      downColor: '#E24444CC',
      borderVisible: false,
      wickUpColor: '#0AC49ECC',
      wickDownColor: '#E24444CC',
      priceLineColor: '#E24444CC',
      priceScaleId: 'right', // 使用右侧价格刻度
      priceLineVisible: true,
    });
  }

  candlestickSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  });
  histogramSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.7,
      bottom: 0,
    },
  });

  candlestickSeries.setData(list as any);
  const valumeData = list.map(d => ({
    time: d.time,
    value: d.value ?? 1000 * Math.random(),
  })) as any;
  histogramSeries.setData(valumeData);
  setTooltip();

  mainChart.timeScale().setVisibleLogicalRange({
    from:
        list.length > maxVisibleBars
          ? list.length - 1 - maxVisibleBars
          : 0,
    to: list.length - 1,
  });
  // mainChart.timeScale().subscribeVisibleTimeRangeChange(changeChartRange);
}

function updateChart() {
  if (!candlestickSeries || !histogramSeries) {
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
    candlestickSeries.update(data);
    histogramSeries.update({
      time: data.time,
      value: Number(item.tradeAmount),
    });
    if (tooltipData.value?.time === data.time) {
      tooltipData.value = data as any;
    }
  }
}

watch(newData, () => {
  updateChart();
});

let oldRect: DOMRect | undefined = undefined;
async function resizeHandler() {
  const rect = mainChartContainer.value?.getBoundingClientRect?.();

  if (mainChart && rect) {
    const widthRangeUp = rect.width + 30;
    const widthRangeLow = rect.width - 30;

    if (
      !oldRect
      || oldRect.width > widthRangeUp
      || oldRect.width < widthRangeLow
    ) {
      oldRect = rect;

      mainChart.resize(rect.width, rect.height);
    }
  }
}

onMounted(async () => {
  oldRect = mainChartContainer.value?.getBoundingClientRect();
  window.addEventListener('resize', resizeHandler);
  await initChart();
  inited.value = true;
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  if (mainChart) {
    mainChart.remove();
  }
});
</script>

<template>
  <div class="relative w-full h-full flex flex-col">
    <div
      ref="mainChartContainer"
      class="w-full h-full relative"
    />
    <div
      v-if="!inited"
      class="absolute top-0 left-0 w-full h-full bg-[#121212] z-10 flex justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <ChartTooltip
      v-if="tooltipData"
      class="absolute left-1 top-1 z-10"
      :data="tooltipData"
    />
  </div>
</template>
