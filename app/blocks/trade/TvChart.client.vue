<script lang="ts" setup>
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { createChart } from 'lightweight-charts';

const props = defineProps<{
  range: ChartRange;
}>();

const { $api } = useNuxtApp();
const { currentPair } = useNetworkConfig();

const inited = ref(false);
const { isMD } = useDevice();
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
  value: number;
} | undefined>();

const { counter } = useInterval(3000, { controls: true });

const { data: newData } = useAsyncData(
  `trade-statistic-${props.range}${currentPair.value?.value}`,
  () => {
    return $api.blockchainTradeStatistic({
      pair: currentPair.value?.value,
      type: rangeType(props.range),
      ...rangeParams(props.range),
    });
  },
  {
    server: false,
    watch: [counter],
  },
);

const maxVisibleBars = 80;
let fetchOldData = false;
async function changeChartRange() {
  const visibleLogicalRange = mainChart!.timeScale()
    .getVisibleLogicalRange();
  if (!visibleLogicalRange) return;
  if (visibleLogicalRange.from <= -20 && !fetchOldData) {
    fetchOldData = true;
    const existingData = candlestickSeries!.data();
    const time = existingData[0]!.time;
    console.log(existingData, rangeParams(props.range, Number(time)));
    const tradeData = await $api.blockchainTradeStatistic(
      { type: rangeType(props.range),
        pair: currentPair.value?.value,
        ...rangeParams(props.range, Number(time)),
      },
    );
    let list = (tradeData ?? [])
      .map((item) => {
        return {
          time: timeToLocal(Number(item.time) / 1000),
          open: Number(item.openPrice),
          high: Number(item.highPrice),
          low: Number(item.lowPrice),
          close: Number(item.closePrice),
          value: Number(item.tradeAmount),
        };
      }).reverse();
    if (list.length === 0) {
      fetchOldData = false;
      return;
    }
    list = list.slice(0, list.length - 1);
    const valumeData = list.map(d => ({
      time: d.time,
      value: d.value ?? 1000 * Math.random(),
      color: d.close >= d.open ? '#0AC49E90' : '#E2444490',
    })) as any;
    candlestickSeries!.setData([...list, ...existingData] as any);
    histogramSeries!.setData([...valumeData, ...histogramSeries!.data()!]);
    fetchOldData = false;
  }
}

function setTooltip() {
  if (!mainChartContainer.value || !mainChart || !candlestickSeries || !histogramSeries) return;
  const allData = candlestickSeries.data();
  const values = histogramSeries.data();
  if (allData.length === 0) {
    return;
  }
  const data = allData[allData.length - 1];
  const value = values[values.length - 1] as any;
  tooltipData.value = { ...data as any, value: value.value };

  // update tooltip
  mainChart.subscribeCrosshairMove((param) => {
    const allData = candlestickSeries!.data();
    const values = histogramSeries!.data();
    const data = param.time ? allData.find(t => t.time === param.time)! : allData[allData.length - 1]!;
    const value = param.time ? values.find(t => t.time === param.time)! : values[values.length - 1]!;
    tooltipData.value = { ...data as any, value: (value as any)?.value };
  });
}

async function initChart() {
  const tradeData = await $api.blockchainTradeStatistic(
    { type: rangeType(props.range),
      pair: currentPair.value?.value,
      ...rangeParams(props.range),
    },
  );
  const list = (tradeData ?? [])
    .map((item) => {
      return {
        time: timeToLocal(Number(item.time) / 1000),
        open: Number(item.openPrice),
        high: Number(item.highPrice),
        low: Number(item.lowPrice),
        close: Number(item.closePrice),
        value: Number(item.tradeAmount),
      };
    })
    .reverse();

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
      lastValueVisible: false,
      priceScaleId: '',
      priceLineVisible: false,
      color: '#333',
      base: 0,
    });
  }

  if (!candlestickSeries) {
    candlestickSeries = mainChart.addCandlestickSeries({
      upColor: '#0AC49E',
      downColor: '#E24444',
      borderVisible: false,
      wickUpColor: '#0AC49E',
      wickDownColor: '#E24444',
      priceScaleId: 'right', // 使用右侧价格刻度
      priceLineVisible: true,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          return price < 0 ? '' : `${formatAmount(price.toString(), 5)}`;
        },
      },
    });
  }

  candlestickSeries.priceScale().applyOptions({
    scaleMargins: {
      top: isMD.value ? 0.1 : 0.2,
      bottom: 0.3,
    },
  });
  histogramSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  });

  candlestickSeries.setData(list as any);
  const valumeData = list.map(d => ({
    time: d.time,
    value: d.value ?? 1000 * Math.random(),
    color: d.close >= d.open ? '#0AC49E90' : '#E2444490',
  })) as any;
  histogramSeries.setData(valumeData);
  setTooltip();

  if (list.length - 1 < maxVisibleBars) {
    mainChart.timeScale().setVisibleLogicalRange({
      from: 0,
      to: maxVisibleBars,
    });
  }
  else {
    mainChart.timeScale().setVisibleLogicalRange({
      from: list.length - 1 - maxVisibleBars,
      to: list.length - 1,
    });
  }

  mainChart.timeScale().subscribeVisibleTimeRangeChange(changeChartRange);
}

function updateChart() {
  if (!candlestickSeries || !histogramSeries) {
    return;
  }
  const item = newData.value?.[0];

  if (item) {
    const data = {
      time: timeToLocal(Number(item.time) / 1000) as Time,
      open: Number(item.openPrice),
      high: Number(item.highPrice),
      low: Number(item.lowPrice),
      close: Number(item.closePrice),
      value: Number(item.tradeAmount),
    };
    candlestickSeries.update(data);
    histogramSeries.update({
      time: data.time,
      value: Number(item.tradeAmount),
      color: Number(item.closePrice) >= Number(item.openPrice) ? '#0AC49E90' : '#E2444490',
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
      class="absolute left-0 md:left-[20px] top-2 z-10"
      :data="tooltipData"
    />
  </div>
</template>
