<script setup lang="ts">
import { formatAmount } from '#imports';

const { isMD, isXL } = useDevice();

const { replace, currentRoute } = useRouter();
const { $api } = useNuxtApp();
const { currentPair } = useNetworkConfig();
const columns = computed(() => {
  const token0 = currentPair.value?.tokens[0];
  const token1 = currentPair.value?.tokens[1];
  return [
    {
      value: 'price',
      label: `Price(${token1?.symbol ?? '-'})`,
    },
    {
      value: 'qty',
      label: `Qty(${token0?.symbol ?? '-'})`,
    },
    ...(isMD.value
      ? [
          {
            value: 'value',
            label: `Value(${token1?.symbol ?? '-'})`,
          },
        ]
      : []),
  ];
});

const { counter } = useInterval(3000, { controls: true });

const { data } = useAsyncData(
  'order-book',
  () => {
    return $api.blockchainOrderBooks({
      pair: currentPair.value?.value.toUpperCase().split('-').join('/'),
    });
  },
  {
    watch: [counter],
    server: false,
  },
);

const sellBList = computed(() => {
  const allQty = (data.value?.orderSellBList ?? []).reduce((sum, item) => {
    return (sum += Number(item.qty));
  }, 0);
  const list = (data.value?.orderSellBList ?? [])
    .map((item) => {
      return {
        ...item,
        qty: item.qty,
        style: {
          '--sell-bar-width': `${(Number(item.qty) / allQty) * 100}%`,
        },
      };
    })
    .reverse();

  if (!isXL.value) {
    return list.slice(0, 5);
  }
  return list;
});

const buyBList = computed(() => {
  const allQty = (data.value?.orderBuyBList ?? []).reduce((sum, item) => {
    return (sum += Number(item.qty));
  }, 0);
  const list = (data.value?.orderBuyBList ?? []).map((item) => {
    return {
      ...item,
      style: {
        '--buy-bar-width': `${(Number(item.qty) / allQty) * 100}%`,
      },
    };
  });
  if (!isXL.value) {
    return list.slice(0, 5);
  }
  return list;
});

const onSelectPrice = (price: string) => {
  replace({ query: { ...(currentRoute.value.query ?? {}), price } });
};
</script>

<template>
  <div class="h-full w-full flex flex-col select-none">
    <div
      class="w-full md:px-4 px-2 md:pt-4 pt-2 md:pb-1.5 pb-1 grid md:grid-cols-3 grid-cols-2"
    >
      <div
        v-for="column in columns"
        :key="column.value"
        class="text-[#999] md:text-xs text-[10px] md:leading-[14px] leading-3 text-nowrap first:text-start text-end"
      >
        {{ column.label }}
      </div>
    </div>

    <div
      v-if="data"
      class="w-full grow grid"
      style="grid-template-rows: 1fr auto 1fr"
    >
      <div
        class="w-full h-full flex flex-col justify-end xl:space-y-2.5 md:space-y-1.5 space-y-1"
      >
        <div
          v-for="item in sellBList"
          :key="JSON.stringify(item)"
          class="sell-price-item w-full grid md:px-4 px-2 md:py-1.5 py-1 md:grid-cols-3 grid-cols-2 md:text-[14px] text-xs text-start cursor-pointer hover:bg-gray-50/10"
          :style="item.style"
          @click="onSelectPrice(item.price)"
        >
          <span
            v-for="col in columns"
            :key="col.value"
            class="first:text-start text-end"
            :class="{ 'text-sell': col.value === 'price' }"
          >
            {{
              formatAmount(item[col.value], col.value === "price" ? 5 : 2, {
                endPad: true,
                format: col.value === "value",
              })
            }}
          </span>
        </div>
      </div>

      <div
        class="md:px-4 px-2 md:py-1.5 xl:py-2.5 py-1 flex items-end cursor-pointer"
        @click="onSelectPrice(data.latestPrice)"
      >
        <span
          class="md:text-[20px] text-base md:leading-6 leading-3 md:me-3 me-1"
        >
          {{ formatAmount(data.latestPrice, 5, { endPad: true }) }}
        </span>
        <span class="md:text-[14px] text-[8px] whitespace-nowrap text-[#999]">
          ≈ {{ formatAmount(data.latestPrice, 2) }} USD
        </span>
      </div>

      <div
        class="h-full flex flex-col justify-start xl:space-y-2.5 space-y-1.5"
      >
        <div
          v-for="item in buyBList"
          :key="JSON.stringify(item)"
          class="buy-price-item w-full grid md:px-4 px-2 md:py-1.5 py-1 md:grid-cols-3 grid-cols-2 md:text-[14px] text-xs text-start cursor-pointer hover:bg-gray-50/10"
          :style="item.style"
          @click="onSelectPrice(item.price)"
        >
          <span
            v-for="col in columns"
            :key="col.value"
            class="first:text-start text-end"
            :class="{ 'text-buy': col.value === 'price' }"
          >
            {{
              formatAmount(item[col.value], col.value === "price" ? 5 : 2, {
                endPad: true,
                format: col.value === "value",
              })
            }}
          </span>
        </div>
      </div>
    </div>
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
