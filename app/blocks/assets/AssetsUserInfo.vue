<script lang="ts" setup>
import { ethers } from 'ethers';
import { BaseEvmApi } from '~/utils/contracts/api';

const { address } = useWallet();
const { isMD } = useDevice();
const { network } = useNetworkConfig();
const api = new BaseEvmApi(network.value.rpc);

const { data } = useAsyncData(`user-assets-${address.value}`, async () => {
  if (!address.value) return;
  const balance = await api.getBalance({ address: address.value });
  return {
    balance,
  };
}, {
  server: false,
  watch: [address],
});

const balanceFormat = computed(() => {
  return ethers.formatEther(data.value?.balance || '0');
});
</script>

<template>
  <div
    class="w-full md:p-6 p-3 border-[1px] border-[#2E2E2E] rounded-xl bg-[#121212]"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center md:space-x-5 space-x-2.5">
        <div>
          <AddressIcon
            :address="address || ethers.ZeroAddress"
            :diameter="isMD ? 80 : 40"
          />
        </div>
        <div class="flex flex-col items-start">
          <div
            class="text-white font-bold md:text-[32px] text-lg md:leading-9 leading-6"
          >
            {{ shortAddress(address || "", 5) }}
          </div>
          <div
            class="md:pt-2 pt-1 text-[#999999] md:text-sm text-xs font-normal flex items-center space-x-1"
          >
            <span>{{ shortAddress(address || "", 5) }}</span>

            <CopyButton :source="address || ''" />
          </div>
        </div>
      </div>
      <div
        class="grow pl-2 text-ellipsis text-sm font-medium text-end overflow-hidden whitespace-nowrap"
      >
        <span v-if="!address">
          <ConnectWalletButton />
        </span>
        <span
          v-else
          :title="balanceFormat"
        >
          {{ formatAmount(balanceFormat, 6) }}
          {{ network?.symbol }}
        </span>
      </div>
    </div>
  </div>
</template>
