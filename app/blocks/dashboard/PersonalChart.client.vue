<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

const { $api } = useNuxtApp();
const { token, user } = storeToRefs(useUserStore());

const { data: powerData, status: powerDataStatus } = useAsyncData(
  `power-single`,
  () => {
    if (!token.value || !user.value) return Promise.resolve(undefined);
    return $api.powerSingle({
      address: user.value!.userAddress,
      // address: '0x56d9dfc0ce2e16a9cc9c0c04829df2de03f458a6',
      type: '1',
    }, token.value);
  },
  { watch: [token, user] },
);

const chartData = computed<ChartData<'bar', (number | [number, number] | null)[]>>(() => ({
  // labels: ['< 500', '500-1k', '1k-2k', '2k-4k', '4k-7k', '7k-10k', '> 10k'],
  labels: powerData.value?.powerRange.map((item) => {
    if (item.low) {
      if (item.high) {
        return `${Number(item.low) / 1000}K-${Number(item.high) / 1000}K`;
      }
      else {
        return `< ${item.low}`;
      }
    }
    else {
      return `> ${item.high}`;
    }
  }) ?? [],
  datasets: [{
    // data: [2500, 1200, null, 2900, 3500, 2000, 900],
    data: powerData.value?.powerRange
      .map((item, index) => index !== powerData.value?.powerIndex ? Number(item.amount) : null) ?? [],
    backgroundColor: '#563D38',
    borderRadius: 8,
    pointStyle: false,
    borderSkipped: false,
    barThickness: 28,
    stack: 'Stack 0',
  },
  {
    // data: [null, null, 2600, null, null, null, null],
    data: powerData.value?.powerRange
      .map((item, index) => index === powerData.value?.powerIndex ? Number(item.amount) : null) ?? [],
    backgroundColor: '#FF623F',
    borderRadius: 8,
    pointStyle: false,
    borderSkipped: false,
    barThickness: 28,
    stack: 'Stack 0',
  },
  ],
}));
const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: { legend: { display: false } },
  layout: { autoPadding: false, padding: 0 },
  scales: {
    x: { type: 'category', ticks: { padding: 10 } },
    y: {
      stacked: true,
      type: 'linear',
      min: 0,
      ticks: {
        padding: 10,
        stepSize: 1000,
        format: { style: 'currency', currency: 'USD' },
        callback: value => value === 0 ? '0' : `${Number(value) / 1000}K`,
      },
      grid: { display: true, color: '#2E2E2E', lineWidth: 1 },
    },
  },
};
</script>

<template>
  <div
    v-if="powerData?.powerRange"
    class="flex-grow mt-[40px] h-[232px]"
  >
    <USkeleton
      v-if="powerDataStatus === 'pending'"
      class="w-full h-[212px]"
    />
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
  <div v-else />
</template>
