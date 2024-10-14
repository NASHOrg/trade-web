<script setup lang="ts">
const { open, address } = useWallet();
const userStore = useUserStore();
</script>

<template>
  <div
    v-if="userStore.user || address"
    class="flex border rounded-[8px] p-[8px] space-x-[8px] bg-transparent cursor-pointer"
    @click="() => open()"
  >
    <NuxtPicture
      src="images/bool_circle_fill_black.png"
      densities="1x 2x"
      height="32"
      width="32"
    />
    <div class="flex flex-col text-[18px] space-y-[4px]">
      <p>{{ shortAddress(userStore.user?.userAddress ?? address) }}</p>
      <p class="text-[#999] text-[14px]">
        Balance: 30.134544 BOOL
      </p>
    </div>
  </div>
  <UButton
    v-else
    class="h-[40px]"
    @click="open"
  >
    Connect Wallet
  </UButton>
</template>

<style lang="scss" scoped></style>
