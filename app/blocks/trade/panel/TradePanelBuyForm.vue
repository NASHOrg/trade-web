<script setup lang="ts">
import { parseEther } from 'ethers';
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { network, tradeApi } from '~/utils/contracts';

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

const tradeStore = useTradeStore();
const balance = ref<string | undefined>();

const { address, open, chainId, switchNetwork } = useWallet();
const { t } = useI18n();
const { currantToken } = storeToRefs(tradeStore);
const { currentRoute } = useRouter();

const { data } = useNuxtData('order-book');
const state = reactive<{
  price: string | undefined;
  quantity: string | undefined;
}>({
  price: data.value?.latestPrice,
  quantity: undefined,
});

const tokenSymbolList = computed(() => {
  return currantToken.value.value.split('/');
});

const amountPercent = computed({
  get() {
    if (!balance.value) {
      return 0;
    }
    return BN(state.quantity ?? 0)
      .div(BN(balance.value.toString()))
      .times(100)
      .toNumber();
  },
  set(value) {
    if (!balance.value) return;
    state.quantity = BN(balance.value.toString())
      .div(10 ** 18)
      .times(BN(value ?? 0))
      .div(100)
      .dp(2, 1)
      .toString();
  },
});
const selectedMode = ref('limit');

const total = computed(() => {
  if (!state.quantity || !state.price) return 0;
  return BN(state.quantity).times(state.price).dp(2, 1).toFormat();
});

watch(
  data,
  () => {
    if (!state.price) {
      state.price = data.value?.latestPrice;
    }
  },
  {
    deep: true,
  },
);

watch(
  currentRoute,
  () => {
    const price = Number(currentRoute.value.query?.price ?? '0');
    if (price && !Number.isNaN(price)) {
      state.price = price.toString();
    }
  },
  {
    deep: true,
  },
);

const isBuying = ref(false);
async function onBuy() {
  // const { success, close } = useTransactionModal({
  //   title: 'Token Approval',
  //   steps: ['approve', 'send'],
  //   token: usdt,
  //   onClose() {
  //     isBuying.value = false;
  //   },
  // });
  // return;
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

async function onSelectMode(mode: (typeof modes)[number]) {
  selectedMode.value = mode.value;
  if (mode.value === 'limit') {
    state.price = undefined;
  }
  else {
    try {
      await refreshNuxtData('order-book');
      state.price = data.value?.latestPrice;
    }
    catch {
      state.price = undefined;
    }
  }
}
</script>

<template>
  <div class="flex flex-col grow space-y-4">
    <div class="form-item">
      <span>Mode</span>
      <div class="flex justify-end space-x-[10px]">
        <div
          v-for="item in modes"
          :key="item.value"
          class="flex items-center gap-2 cursor-pointer"
          @click="onSelectMode(item)"
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
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end"
        />
        <span class="text-white"> {{ tokenSymbolList[1] }}</span>
      </div>
    </div>
    <div class="form-item">
      <span>Qty</span>
      <div class="flex justify-end items-center">
        <CustomInput
          v-model="state.quantity"
          placeholder="0.0"
          :precision="2"
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end"
        />
        <span class="text-white"> {{ tokenSymbolList[0] }}</span>
      </div>
    </div>
    <div class="pb-[16px]">
      <AmountSlider v-model="amountPercent" />
    </div>
    <div class="form-item">
      <span>Value</span>
      <div class="flex justify-end items-center space-x-[10px]">
        <span>{{ total }}</span>
        <span class="text-white"> {{ tokenSymbolList[1] }}</span>
      </div>
    </div>
    <div class="flex justify-between items-center !mt-[6px]">
      <div class="text-white text-[14px] flex space-x-1">
        <span>Balance:</span>
        <TokenBalance
          v-if="currantToken.tokens[1]"
          :address="address"
          :token="currantToken.tokens[1]"
          @change="(value) => (balance = value)"
        />
      </div>
      <UButton
        to=""
        variant="outline"
        size="xs"
        class="rounded-[4px] h-[22px] text-[12px] !px-1"
      >
        Add Fund
      </UButton>
    </div>
    <div class="grow" />
    <UButton
      color="buy"
      block
      class="h-[44px] rounded-[8px]"
      :loading="isBuying"
      @click="onBuy"
    >
      Buy Bool
    </UButton>
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px];
}
</style>
