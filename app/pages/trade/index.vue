<script lang="ts" setup>
// import { onMounted } from "vue";

definePageMeta({
  middleware: () => {
    const tradeStore = useTradeStore();
    const { tokenOptions } = storeToRefs(tradeStore);
    const tokenValue = tokenOptions.value[0]?.value ?? 'bool-usdt';
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
  <div class="container" />
</template>
