<script setup lang="ts">
const { open } = useWallet();
</script>

<template>
  <UButton
    primary
    class="h-[40px]"
    @click="open"
  >
    Connect Wallet
  </UButton>
</template>

<style lang="scss" scoped></style>
