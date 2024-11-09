<script setup lang="ts">
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { parseEther } from 'ethers';

const props = defineProps<{
  mode: 'limit' | 'market';
}>();

const tradeStore = useTradeStore();
const balance = ref<string | undefined>();

const { address, open, chainId, switchNetwork } = useWallet();
const { t } = useI18n();
const { currantToken } = storeToRefs(tradeStore);
const { currentRoute } = useRouter();
const { network, tradeApi } = useNetworkConfig();

const { data } = useNuxtData('order-book');
const state = reactive<{
  price: string | undefined;
  quantity: string | undefined;
}>({
  price: data.value?.latestPrice,
  quantity: undefined,
});

const tokenSymbolList = computed(() => {
  return currantToken.value?.value.toUpperCase().split('-') ?? [];
});

const amountPercent = computed({
  get() {
    if (!balance.value || !state.quantity) {
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
      .times(BN(value ?? 0))
      .div(100)
      .dp(2, 1)
      .toString();
  },
});

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
watch(
  () => props.mode,
  async () => {
    state.quantity = undefined;
    if (props.mode === 'limit') {
      state.price = undefined;
    }
    else {
      state.price = data.value?.latestPrice;
      refreshNuxtData('order-book');
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="flex flex-col grow space-y-3">
    <!-- <div class="form-item">
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
    </div> -->
    <div
      v-if="mode === 'limit'"
      class="form-item"
    >
      <span>Price</span>
      <div class="flex justify-end items-center">
        <CustomInput
          v-model="state.price"
          placeholder="0.0"
          :precision="5"
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end !text-white"
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
          input-class="!text-[16px] !bg-transparent !text-end !text-white"
        />
        <span class="text-white"> {{ tokenSymbolList[0] }}</span>
      </div>
    </div>
    <div>
      <AmountSlider v-model:value="amountPercent" />
    </div>
    <div class="form-item">
      <span>Value</span>
      <div class="flex justify-end items-center space-x-[10px]">
        <span>{{ total }}</span>
        <span class="text-white"> {{ tokenSymbolList[1] }}</span>
      </div>
    </div>
    <div class="flex justify-between items-center !mt-3">
      <div
        v-if="address"
        key="balance"
        class="text-white text-[14px] flex space-x-1"
      >
        <span>Balance:</span>
        <TokenBalance
          v-if="currantToken?.tokens[0]"
          :address="address"
          :token="currantToken?.tokens[0]"
          @change="(value) => (balance = value)"
        />
      </div>
      <div v-else />
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
    <div class="pt-5 w-full pb-6">
      <UButton
        v-if="!address"
        block
        color="gray"
        class="h-[40px] rounded-full border-0 ring-0 text-sm font-normal bg-[#272727]"
        @click="open"
      >
        <span class="text-primary"> Connect Wallet</span>
      </UButton>
      <UButton
        v-else
        color="sell"
        block
        class="h-[40px] rounded-full border-0 ring-0 text-sm font-medium"
        :loading="isSelling"
        @click="onSell"
      >
        Sell Bool
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#B0B0B0] rounded-[4px] flex justify-between items-center px-[16px] text-sm font-normal;
  @apply border-[1px] border-[#4D4D4D];
}
</style>
