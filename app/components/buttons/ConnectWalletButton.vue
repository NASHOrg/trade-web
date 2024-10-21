<script setup lang="ts">
import { formatEther } from 'ethers';
import { stakeApi } from '~/utils/contracts';

const { open, address } = useWallet();
const userStore = useUserStore();

const { data: balance } = useAsyncData(
  `bool-balance-${address}`,
  async () => {
    if (!address.value) return;
    const balance = await stakeApi.getBalance({ address: address.value });
    return formatAmount(formatEther(balance));
  },
  { watch: [address] },
);
</script>

<template>
  <div>
    <div
      v-if="userStore.user || address"
      class="flex border rounded-[8px] p-[8px] space-x-[8px] bg-transparent cursor-pointer"
      @click="() => open({ view: 'Account' })"
    >
      <NuxtPicture
        src="images/bool_circle_fill_black.png"
        densities="1x 2x"
        height="32"
        width="32"
      />
      <div class="flex flex-col text-[18px] space-y-[4px]">
        <p>{{ shortAddress(address) }}</p>
        <p class="text-[#999] text-[14px]">
          Balance: {{ balance }} BOOL
        </p>
      </div>
    </div>
    <UButton
      v-else
      class="h-[40px]"
      :ui="{ rounded: 'rounded-[10px]' }"
      @click="open"
    >
      {{ $t('connect') }}
    </UButton>
  </div>
</template>
