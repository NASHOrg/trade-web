<script setup lang="ts">
import { formatAmount } from '#imports';

const tradeStore = useTradeStore();
const { replace, currentRoute } = useRouter();
const { $api } = useNuxtApp();
const { currantToken } = storeToRefs(tradeStore);
const columns = computed(() => {
  const token0 = currantToken.value?.tokens[0];
  const token1 = currantToken.value?.tokens[1];
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
      value: 'value',
      label: `Value(${token1?.symbol ?? '-'})`,
    },
  ];
});

const { counter } = useInterval(10000, { controls: true });
const { data } = useAsyncData(
  'order-book',
  () => {
    return $api.blockchainOrderBooks({});
  },
  {
    watch: [counter],
  },
);

const sellBList = computed(() => {
  const allQty = (data.value?.orderSellBList ?? []).reduce((sum, item) => {
    return (sum += Number(item.qty));
  }, 0);
  return (data.value?.orderSellBList ?? [])
    .map((item) => {
      return {
        ...item,
        style: {
          '--sell-bar-width': `${(Number(item.qty) / allQty) * 100}%`,
        },
      };
    })
    .reverse();
});

const buyBList = computed(() => {
  const allQty = (data.value?.orderBuyBList ?? []).reduce((sum, item) => {
    return (sum += Number(item.qty));
  }, 0);
  return (data.value?.orderBuyBList ?? [])
    .map((item) => {
      return {
        ...item,
        style: {
          '--buy-bar-width': `${(Number(item.qty) / allQty) * 100}%`,
        },
      };
    })
    .reverse();
});

const onSelectPrice = (price: string) => {
  replace({ query: { ...(currentRoute.value.query ?? {}), price } });
};
</script>

<template>
  <div class="h-full w-full flex flex-col select-none">
    <div class="px-4 pt-4 pb-1.5 grid grid-cols-3">
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] text-xs leading-[14px] text-center text-nowrap first:text-start last:text-end"
      >
        {{ column.label }}
      </div>
    </div>

    <template v-if="data">
      <div class="grow flex flex-col justify-end space-y-2.5">
        <div
          v-for="item in sellBList"
          :key="JSON.stringify(item)"
          class="sell-price-item grid px-4 py-1.5 grid-cols-3 text-[14px] text-start cursor-pointer hover:bg-gray-50/10"
          :style="item.style"
          @click="onSelectPrice(item.price)"
        >
          <span class="text-sell">{{ formatAmount(item.price, 5) }}</span>
          <span class="text-center"> {{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>

      <div
        class="px-4 py-2.5 flex items-end cursor-pointer"
        @click="onSelectPrice(data.latestPrice)"
      >
        <span class="text-[20px] me-3">
          {{ formatAmount(data.latestPrice, 5) }}
        </span>
        <span class="text-[14px] text-[#999]">
          ≈ {{ formatAmount(data.latestPrice, 2) }} USD
        </span>
      </div>

      <div class="grow flex flex-col justify-start space-y-2.5">
        <div
          v-for="item in buyBList"
          :key="JSON.stringify(item)"
          class="buy-price-item grid px-4 py-1.5 grid-cols-3 text-[14px] text-start cursor-pointer hover:bg-gray-50/10"
          :style="item.style"
          @click="onSelectPrice(item.price)"
        >
          <span class="text-buy">{{ formatAmount(item.price, 5) }}</span>
          <span class="text-center"> {{ formatAmount(item.qty, 2) }}</span>
          <span class="text-end">{{ formatAmount(item.value, 2) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.sell-price-item {
  @keyframes price-bar-animation {
    from {
      width: 0;
    }
    to {
      width: var(--sell-bar-width);
    }
  }
  &::before {
    content: "";
    width: var(--sell-bar-width);
    @apply bg-sell/20;
    animation: price-bar-animation linear 0.3s;
  }
}

.buy-price-item {
  @keyframes price-bar-animation {
    from {
      width: 0;
    }
    to {
      width: var(--buy-bar-width);
    }
  }
  &::before {
    content: "";
    width: var(--buy-bar-width);
    @apply bg-buy/20;
    animation: price-bar-animation linear 0.3s;
  }
}

.sell-price-item,
.buy-price-item {
  position: relative;

  &::before {
    position: absolute;
    height: 100%;
    right: 0;
    z-index: -1;
  }
}
</style>
