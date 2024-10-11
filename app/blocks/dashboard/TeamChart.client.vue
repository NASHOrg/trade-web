<script setup lang="ts">
import { Line } from 'vue-chartjs';
import type { ChartData, ChartOptions, Point } from 'chart.js';

const chartData: ChartData<'line', (number | Point | null)[], unknown> = {
  labels: Array.from({ length: 8 }, (_, i) =>
    new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
  ).reverse(),
  datasets: [{
    data: [3500, 800, 1000, 800, 1900, 1100, 2800, 1900],
    borderColor: '#FF623F',
    borderWidth: 2,
    pointStyle: false,
  }],
};
const chartOptions: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: { legend: { display: false } },
  layout: { autoPadding: false, padding: 0 },
  scales: {
    x: { type: 'category', ticks: { padding: 10 } },
    y: {
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
  <div class="flex-grow">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
