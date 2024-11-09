<script setup lang="ts">
import { TokensSlideover, UAvatar, UIcon } from '#components';

// const { address } = useWallet();
const tradeStore = useTradeStore();
const { currantToken } = storeToRefs(tradeStore);
const { isXL, isMD } = useDevice();

const slideover = useSlideover();
function openTokens() {
  slideover.open(TokensSlideover);
}
</script>

<template>
  <div class="w-full grow flex flex-col border-t-[2px] border-[#2E2E2E] pb-20">
    <div
      v-if="isMD"
      class="w-full h-[840px] grid grid-cols-10 grid-rows-10 border-b-[2px] border-[#2E2E2E]"
    >
      <div
        class="h-full border-r-[2px] border-[#2E2E2E]"
        :class="['xl:col-span-2', 'col-span-3 row-span-10'].join(' ')"
      >
        <TradeTokens v-if="isXL" />
        <template v-else>
          <div
            class="flex items-center space-x-2 cursor-pointer px-3 py-2 border-b-[2px] border-[#2E2E2E]"
            @click="openTokens"
          >
            <UIcon
              name="i-weui-arrow-filled"
              class="w-5 h-5"
            />
            <UAvatar
              :alt="currantToken?.label || 'Token'"
              size="xs"
            />
            <span>
              {{ currantToken?.label ?? "" }}
            </span>
          </div>
          <TradeForm />
        </template>
      </div>

      <div
        :class="
          [
            'xl:col-span-6 xl:row-span-5',
            'md:col-span-7 md:row-span-5',
            '',
          ].join(' ')
        "
      >
        <TradeChart />
      </div>

      <div
        class="xl:border-l-[2px] border-t-[2px] border-[#2E2E2E]"
        :class="
          [
            'xl:col-span-2 xl:row-span-10',
            'md:col-span-7 md:row-span-5',
            '',
          ].join(' ')
        "
      >
        <TradeOrders />
      </div>

      <div
        v-if="isXL"
        class="border-t-[1px] border-[#2E2E2E]"
        :class="
          [
            'xl:col-span-6 xl:row-span-5',
            'md:col-span-3 md:row-span-5',
            '',
          ].join(' ')
        "
      >
        <TradeForm />
      </div>
    </div>

    <div
      v-else
      class="w-full"
    >
      <TradeChart />
      <div
        class="w-full flex px-2.5 border-y-[2px] border-[#2E2E2E] gap-1 overflow-hidden"
      >
        <TradeForm class="w-[60%]" />
        <TradeOrders class="w-[40%] !h-[430px]" />
      </div>
    </div>
    <div class="w-full min-h-[270px]">
      <TradeHistory />
    </div>
  </div>
</template>

<style scoped></style>



<!-- <script lang="ts" setup>
// import { onMounted } from "vue";

definePageMeta({
  middleware: () => {
    const tradeStore = useTradeStore();
    const tokenValue = tradeStore.tokenOptions?.[0]?.value ?? 'bool-usdt';
    return navigateTo(`/trade/${tokenValue}`);
  },
});

// onMounted(() => {

//   if (tokenValue) {
//     return navigateTo(`/trade/${tokenValue}`);
//   }
// });
</script>

<template>
  <div class="container">
    Trade
  </div>
</template> -->
