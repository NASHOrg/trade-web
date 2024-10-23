<script setup lang="ts">
const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);
const columns = computed(() => {
  const token0 = currantToken.value.tokens[0];
  const token1 = currantToken.value.tokens[1];
  return [
    {
      value: 'price',
      label: `Price(${token1?.symbol ?? '-'})`,
    },
    {
      value: 'qty',
      label: `Qty(${token0?.symbol ?? '-'})`,
    },
    {
      value: 'time',
      label: 'Time',
    },
  ];
});

const data = [
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
</script>

<template>
  <div class="h-[550px] flex flex-col">
    <div class="grid grid-cols-3">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] text-sm leading-base text-center text-nowrap first:text-start last:text-end"
      >
        {{ column.label }}
      </div>
    </div>

    <div class="grow space-y-2.5 mt-3.5 scrollbar">
      <div
        v-for="(item, i) in data"
        :key="i"
        class="grid grid-cols-3 text-[14px] text-start"
      >
        <span :class="item.type === 'sell' ? 'text-sell' : 'text-buy'">
          {{ item.price }}
        </span>
        <span class="text-center">{{ item.qtl }}</span>
        <span class="text-end">{{ item.time }}</span>
      </div>
    </div>
  </div>
</template>
