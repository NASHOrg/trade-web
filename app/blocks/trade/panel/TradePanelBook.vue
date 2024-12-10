<script setup lang="ts">
import BN from 'bignumber.js';
import { formatAmount } from '#imports';

const { isMD, isXL } = useDevice();

const { $api } = useNuxtApp();
const { currentPair } = useNetworkConfig();
const selectedPrice = useState('selected-price');

const orderAmount = computed(() => {
  return isXL.value ? 12 : 5;
});

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
  'order-book' + currentPair.value.value,
  () => {
    return $api.blockchainOrderBooks({
      pair: currentPair.value?.value,
    });
  },
  {
    watch: [counter],
    server: false,
  },
);

function itemWidth(item: { qty: string }) {
  if (!data.value) return '0';
  const maxQty = BN.max(
    ...(data.value?.orderSellBList?.slice(0, orderAmount.value) ?? []).map(a => BN(a.qty)),
    ...(data.value?.orderBuyBList?.slice(0, orderAmount.value) ?? []).map(a => BN(a.qty)),
  );
  return BN(item.qty).div(maxQty).times(BN(100)).toFixed(0);
}

const onSelectPrice = (price: string) => {
  selectedPrice.value = price;
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
      class="w-full h-full grid grid-rows-[1fr_44px_1fr]"
    >
      <div
        class="w-full flex flex-col justify-end xl:space-y-2.5 md:space-y-1.5 space-y-1"
      >
        <div
          v-for="item in data.orderSellBList?.slice(0, orderAmount) ?? []"
          :key="item.price"
          class="sell-price-item w-full grid md:px-4 px-2 md:py-1.5 py-1 md:grid-cols-3 grid-cols-2 md:text-[14px] text-xs text-start cursor-pointer hover:bg-gray-50/10"
          :style="{ '--sell-bar-width': itemWidth(item) + '%' }"
          @click="onSelectPrice(item.price)"
        >
          <span
            v-for="col in columns"
            :key="col.value"
            class="first:text-start text-end"
            :class="{ 'text-sell': col.value === 'price' }"
          >
            <span v-if="col.value === 'price'">
              {{ formatAmount(BN(item.value).div(BN(item.qty)).toString(), 5, { endPad: true, format: true }) }}
            </span>
            <span v-else>
              {{
                formatAmount(item[col.value], 2, {
                  endPad: true,
                  format: col.value === "value",
                })
              }}
            </span>
          </span>
        </div>
      </div>

      <div
        class="md:px-4 px-2 flex items-center cursor-pointer"
        @click="onSelectPrice(data.latestPrice)"
      >
        <span
          class="md:text-[20px] text-base md:leading-6 leading-3 md:me-3 me-1"
        >
          {{ formatAmount(data.latestPrice, 5, { endPad: true }) }}
        </span>
        <span class="md:text-[14px] text-[8px] whitespace-nowrap text-[#999]">
          ≈ {{ formatAmount(data.latestPrice, 2, { rounded: true, endPad: true }) }} USD
        </span>
      </div>

      <div
        class="flex flex-col justify-start xl:space-y-2.5 md:space-y-1.5 space-y-1"
      >
        <div
          v-for="item in data.orderBuyBList?.slice(0, orderAmount) ?? []"
          :key="JSON.stringify(item)"
          class="buy-price-item w-full grid md:px-4 px-2 md:py-1.5 py-1 md:grid-cols-3 grid-cols-2 md:text-[14px] text-xs text-start cursor-pointer hover:bg-gray-50/10"
          :style="{ '--buy-bar-width': itemWidth(item) + '%' }"
          @click="onSelectPrice(item.price)"
        >
          <span
            v-for="col in columns"
            :key="col.value"
            class="first:text-start text-end"
            :class="{ 'text-buy': col.value === 'price' }"
          >
            <span v-if="col.value === 'price'">
              {{ formatAmount(item.price, 5, { endPad: true, format: true }) }}
            </span>
            <span v-else>{{
              formatAmount(item[col.value], 2, {
                endPad: true,
                format: true,
              })
            }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sell-price-item {
  @keyframes price-bar-animation {
    0% {
      width: 100%;
      opacity: .2;
    }
    25% {
      width: 100%;
      opacity: .4;
    }
    50% {
      width: 100%;
      opacity: .2;
    }
    51% {
      width: 0;
      opacity: .1;
    }
    100% {
      width: var(--buy-bar-width);
      opacity: .1;
    }
  }
  &::before {
    content: "";
    width: var(--sell-bar-width);
    @apply bg-sell;
    opacity: .1;
    animation: price-bar-animation linear 0.4s;
  }
}

.buy-price-item {
  @keyframes price-bar-animation {
    0% {
      width: 100%;
      opacity: .2;
    }
    25% {
      width: 100%;
      opacity: .4;
    }
    50% {
      width: 100%;
      opacity: .2;
    }
    51% {
      width: 0;
      opacity: .1;
    }
    100% {
      width: var(--buy-bar-width);
      opacity: .1;
    }
  }
  &::before {
    content: "";
    width: var(--buy-bar-width);
    @apply bg-buy;
    opacity: .1;
    animation: price-bar-animation linear 0.4s;
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
