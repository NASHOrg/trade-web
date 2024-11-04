<script setup lang="ts">
// import { formatEther } from "ethers";
// import { stakeApi } from "~/utils/contracts";

const { open, address } = useWallet();
const userStore = useUserStore();

// const { data: balance } = useAsyncData(
//   `bool-balance-${address}`,
//   async () => {
//     if (!address.value) return;
//     const balance = await stakeApi.getBalance({ address: address.value });
//     return formatAmount(formatEther(balance));
//   },
//   { watch: [address] },
// );
</script>

<template>
  <div>
    <div
      v-if="userStore.user || address"
      class="flex border-[1px] border-primary rounded-[4px] px-2 py-1.5 space-x-[8px] bg-transparent cursor-pointer"
      @click="() => open({ view: 'Account' })"
    >
      <NuxtPicture
        src="images/bool_circle_fill_black.png"
        densities="1x 2x"
        height="18"
        width="18"
      />
      <div class="flex items-center text-xs leading-4">
        <p>{{ shortAddress(address, 4) }}</p>
        <UIcon
          name="i-icon-park-solid-down-one"
          class="left-[2px] bg-[#999999]"
        />
        <!-- <p class="text-[#999] text-xs leading-3">Balance: {{ balance }} BOOL</p> -->
      </div>
    </div>
    <UButton
      v-else
      class="h-[30px] text-sm leading-6 font-normal px-[10px]"
      :ui="{ rounded: 'rounded-[4px]' }"
      @click="open"
    >
      {{ $t("connect") }}
    </UButton>
  </div>
</template>
