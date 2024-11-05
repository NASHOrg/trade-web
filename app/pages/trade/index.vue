<script lang="ts" setup>
import { onMounted } from 'vue';

const tradeStore = useTradeStore();
const { tokenOptions } = storeToRefs(tradeStore);

onMounted(() => {
  const tokenValue = tokenOptions.value[0]?.value;

  if (tokenValue) {
    return navigateTo(`/trade/${tokenValue}`);
  }
});
</script>

<template>
  <div class="container">
    trade swap
  </div>
</template>
