<script setup lang="ts">
import { parseEther } from 'ethers';
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { network, tradeApi } from '~/utils/contracts';

const { address, open, chainId, switchNetwork } = useWallet();
const { t } = useI18n();

const state = reactive({
  price: undefined,
  quantity: undefined,
});

const modes = [
  {
    value: 'limit',
    label: 'Limit',
  },
  {
    value: 'market',
    label: 'Market',
  },
];
const amountPercent = ref(0);
const selectedMode = ref('limit');

const total = computed(() => {
  if (!state.quantity || !state.price) return 0;
  return BN(state.quantity).times(state.price).dp(2, 1).toFormat();
});

const isBuying = ref(false);
async function onBuy() {
  isBuying.value = true;
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    if (!state.quantity || !state.price) return;
    const amount = parseEther(state.quantity);
    const pay = tradeApi.calcUsdt(state.quantity, state.price);
    const isApproved = await tradeApi.isUsdtApproved(address.value, pay);
    if (!isApproved) {
      await tradeApi.approveUsdt(provider);
    }
    const tx = await tradeApi.createBuyOrder(provider, { amount, pay });
    state.price = undefined;
    state.quantity = undefined;
    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
    });
  }
  catch (error) {
    handleJsonRpcError(error, toast);
  }
  finally {
    isBuying.value = false;
  }
}
</script>

<template>
  <div class="form-item">
    <span>Mode</span>
    <div class="flex justify-end space-x-[10px]">
      <div
        v-for="item in modes"
        :key="item.value"
        class="flex items-center gap-2 cursor-pointer"
        @click="selectedMode= item.value"
      >
        <IconActiveRadio
          v-if="selectedMode === item.value"
          class="size-[16px] text-white"
        />
        <IconInactiveRadio
          v-else
          class="size-[16px]"
        />
        <span
          :class="selectedMode === item.value ? 'text-white' : 'text-[#999]'"
        >{{ item.label }}</span>
      </div>
    </div>
  </div>
  <div
    v-if="selectedMode === 'limit'"
    class="form-item"
  >
    <span>Price</span>
    <div class="flex justify-end items-center">
      <CustomInput
        v-model="state.price"
        placeholder="0.0"
        :precision="5"
        input-class="!text-[16px] !bg-transparent !text-end"
      />
      <span
        class="text-white"
      >
        USDT</span>
    </div>
  </div>
  <div class="form-item">
    <span>Qty</span>
    <div class="flex justify-end items-center">
      <CustomInput
        v-model="state.quantity"
        placeholder="0.0"
        :precision="2"
        input-class="!text-[16px] !bg-transparent !text-end"
      />
      <span
        class="text-white"
      >
        BOOL</span>
    </div>
  </div>
  <div class="pb-[16px]">
    <AmountSlider v-model="amountPercent" />
  </div>
  <div class="form-item">
    <span>Value</span>
    <div class="flex justify-end items-center space-x-[10px]">
      <span>{{ total }}</span>
      <span
        class="text-white"
      >
        USDT</span>
    </div>
  </div>
  <div class="flex justify-between items-center mt-[6px]">
    <span class="text-white text-[14px]">Balance: 440.3456 USDT</span>
    <UButton
      to=""
      variant="outline"
      size="xs"
      class="mt-[6px] rounded-[4px] h-[22px] text-[12px]"
    >
      Add Fund
    </UButton>
  </div>
  <UButton
    color="buy"
    block
    class="h-[44px] rounded-[8px]"
    :loading="isBuying"
    @click="onBuy"
  >
    Buy Bool
  </UButton>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
