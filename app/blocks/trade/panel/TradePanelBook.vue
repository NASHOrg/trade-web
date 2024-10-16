<script setup lang="ts">
const data = [
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'buy',
  },
  {
    price: '0.45468',
    qtl: '1000',
    time: '12:00:00',
    type: 'sell',
  },
];
const columns = [
  {
    value: 'price',
    label: 'Price',
  },
  {
    value: 'qty',
    label: 'Qty',
  },
  {
    value: 'time',
    label: 'Time',
  },
];
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-3">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999]"
      >
        {{ column.label }}
      </div>
    </div>
    <div
      v-for="(item, i) in data"
      :key="i"
    >
      <div class="grid grid-cols-3 mt-[10px] text-[14px] first:mt-[14px]">
        <span class="text-[#0ac491]">{{ item.price }}</span>
        <span>{{ item.qtl }}</span>
        <span>{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>
