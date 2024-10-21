<script setup lang="ts">
const { address } = useWallet();
</script>

<template>
  <div class="flex flex-col items-center pb-[40px] w-full">
    <TradeTokens />
    <TradePanel class="mt-[40px]" />
    <TradeHistory
      v-if="address"
      class="mt-[28px]"
    />
  </div>
</template>

<style scoped>

</style>
