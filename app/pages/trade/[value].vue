<script setup lang="ts">
// const { address } = useWallet();
</script>

<template>
  <div class="w-full grow flex flex-col border-t-[2px] border-[#2E2E2E] pb-20">
    <div
      class="w-full h-[840px] grid grid-cols-10 grid-rows-10 border-b-[2px] border-[#2E2E2E]"
    >
      <div
        class="xl:col-span-2 md:col-span-3 row-span-10 h-full border-r-[2px] border-[#2E2E2E]"
      >
        <TradeTokens />
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
        Chart
      </div>

      <div
        class="border-l-[2px] border-[#2E2E2E]"
        :class="
          [
            'xl:col-span-2 xl:row-span-10',
            'md:col-span-4 md:row-span-5',
            '',
          ].join(' ')
        "
      >
        <TradeOrders />
      </div>
      <div
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
    <div class="w-full min-h-[270px]">
      <TradeHistory />
    </div>
  </div>
</template>

<style scoped></style>
