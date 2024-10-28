<script setup lang="ts">
import { Line } from 'vue-chartjs';
import type { ChartData, ChartOptions, Point } from 'chart.js';
import BigNumber from 'bignumber.js';

const { $api } = useNuxtApp();
const { user, token } = storeToRefs(useUserStore());

const { data: rewardsData, status: rewardsStatus } = useAsyncData(
  `rewards-history-last-8-days`,
  () => {
    if (!token.value || !user.value) return Promise.resolve(undefined);
    return $api.powerList({
      address: user.value!.userAddress,
      // address: '0x56d9dfc0ce2e16a9cc9c0c04829df2de03f458a6',
      type: '0',
      pageNumber: '1',
      pageSize: 8,
    }, token.value);
  },
  { watch: [token, user] },
);

const chartData = computed<ChartData<'line', (number | Point | null)[]>>(() => ({
  labels: Array.from({ length: 8 }, (_, i) =>
    new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
      .toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
  ).reverse(),
  datasets: [{
    data: rewardsData.value?.items
      .map(item => BigNumber(item.power).dp(6, 1).toNumber())
      .concat(Array(8).fill(null))
      .slice(0, 8)
      .reverse() ?? [],
    borderColor: '#FF623F',
    borderWidth: 2,
    pointStyle: false,
  }],
}));

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
        // stepSize: 1000,
        // format: { style: 'currency', currency: 'USD' },
        callback: value => value === 0 ? '0' : `${Number(value) / 1000}K`,
      },
      grid: { display: true, color: '#2E2E2E', lineWidth: 1 },
    },
  },
};
</script>

<template>
  <div
    v-if="Number(rewardsData?.items?.length ?? 0) > 0"
    class="mt-[40px] flex-grow h-[232px]"
  >
    <USkeleton
      v-if="rewardsStatus === 'pending'"
      class="w-full h-[212px]"
    />
    <Line
      v-else
      :data="chartData"
      :options="chartOptions"
    />
  </div>
  <div
    v-else
    class="h-[20px]"
  />
</template>

<style scoped lang="scss">

</style>
