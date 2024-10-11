<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

const chartData: ChartData<'bar', (number | [number, number] | null)[], unknown> = {
  labels: ['< 500', '500-1k', '1k-2k', '2k-4k', '4k-7k', '7k-10k', '> 10k'],
  datasets: [{
    data: [3500, 800, 1000, 800, 1900, 1100, 2800],
    backgroundColor: '#FF623F',
    borderRadius: 8,
    borderWidth: 2,
    pointStyle: false,
  }],
};
const chartOptions: ChartOptions<'bar'> = {
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
    <Bar
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
