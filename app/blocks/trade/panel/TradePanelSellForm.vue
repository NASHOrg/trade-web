<script setup lang="ts">
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { parseEther } from 'ethers';
import { network, tradeApi } from '~/utils/contracts';

const { address, open, chainId, switchNetwork } = useWallet();
const { bool } = useNetworkConfig();
const { t } = useI18n();
const state = reactive<{ price: string | undefined; quantity: string | undefined }>({
  price: undefined,
  quantity: undefined,
});

const balance = ref<bigint | undefined>();

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
const selectedMode = ref('limit');

const amountPercent = computed({
  get() {
    if (!balance.value) {
      return 0;
    }
    return BN(state.quantity ?? 0).div(BN(balance.value.toString()).div(10 ** 18)).times(100).toNumber();
  },
  set(value) {
    if (!balance.value) return;
    state.quantity = BN(balance.value.toString()).div(10 ** 18).times(BN(value ?? 0)).div(100).dp(2, 1).toString();
  },
});

const total = computed(() => {
  if (!state.quantity || !state.price) return 0;
  return BN(state.quantity).times(state.price).dp(2, 1).toFormat();
});

const isSelling = ref(false);
async function onSell() {
  isSelling.value = true;
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    if (!state.quantity || !state.price) {
      return;
    }
    const amount = parseEther(state.quantity);
    const receive = tradeApi.calcUsdt(state.price, state.quantity);
    const tx = await tradeApi.createSellOrder(provider, { amount, receive });
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
    isSelling.value = false;
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
  <AmountSlider v-model="amountPercent" />
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
    <div class="text-white text-[14px] flex space-x-1">
      <span>Balance:</span>
      <TokenBalance
        :address="address"
        :token="bool"
        :config="{ showSymbol: true }"
        @change="(value) => balance = value"
      />
    </div>
    <UButton
      to=""
      variant="outline"
      size="xs"
      class="mt-[6px] rounded-[4px] h-[22px] text-[12px]"
    >
      Add Fund
    </UButton>
  </div>
  <div class="grow" />
  <UButton
    color="sell"
    block
    class="h-[44px] rounded-[8px]"
    :loading="isSelling"
    @click="onSell"
  >
    Sell Bool
  </UButton>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
