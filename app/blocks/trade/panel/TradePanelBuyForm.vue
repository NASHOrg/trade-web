<script setup lang="ts">
import { parseEther } from 'ethers';
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { DepositModal } from '#components';

const props = defineProps<{
  mode: 'limit' | 'market';
}>();

// const modes = [
//   {
//     value: "limit",
//     label: "Limit",
//   },
//   {
//     value: "market",
//     label: "Market",
//   },
// ];

const tradeStore = useTradeStore();
const { addOrder } = useOrders();
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
  total: string | undefined;
}>({
  price: data.value?.latestPrice,
  quantity: undefined,
  total: undefined,
});

const tokenSymbolList = computed(() => {
  return currantToken.value?.label.split('/') ?? [];
});

const price = computed({
  get: () => state.price,
  set: (val) => {
    state.price = val;

    if (!Number(state.quantity || '0') || !Number(state.price || '0')) {
      state.total = '0';
    }
    else {
      const _total = BN(state.quantity || '0')
        .times(state.price || '0')
        .dp(2, 1);

      if (_total.gt(balance.value || '0')) {
        const q = BN(balance.value || '0')
          .div(state.price || '0')
          .dp(2, 1);
        quantity.value = !q.isFinite() || q.isZero() ? '0' : q.toString();
      }
      else {
        state.total = _total.toString();
      }
    }
  },
});

const quantity = computed({
  get: () => state.quantity,
  set: (val) => {
    state.quantity = val;

    if (!Number(state.quantity || '0') || !Number(state.price || '0')) {
      state.total = '0';
    }
    else {
      state.total = BN(state.quantity || '0')
        .times(state.price || '0')
        .dp(2, 1)
        .toString();
    }
  },
});

const total = computed({
  get: () => state.total,
  set: (val) => {
    state.total = val;

    if (!Number(val || '0') || !Number(price.value || '0')) {
      state.quantity = '0';
    }
    else {
      state.quantity = BN(val || '0')
        .div(price.value || '0')
        .dp(2, 1)
        .toString();
    }
  },
});

const amountPercent = computed({
  get() {
    if (!balance.value || !state.quantity) {
      return 0;
    }
    return BN(state.total ?? 0)
      .div(BN(balance.value.toString()))
      .times(100)
      .toNumber();
  },
  set(value) {
    if (!balance.value) return;
    if (!Number(state.price || '0')) {
      const _price = Number(currentRoute.value.query?.price ?? '0');
      if (_price && !Number.isNaN(_price)) {
        price.value = _price.toString();
      }
    }
    total.value = BN(balance.value.toString())
      .times(BN(value ?? 0).dividedBy(100))
      .dp(2, 1)
      .toString();
  },
});

watch(
  data,
  () => {
    if (!price.value) {
      price.value = data.value?.latestPrice;
    }
  },
  {
    deep: true,
  },
);

watch(
  currentRoute,
  () => {
    const _price = Number(currentRoute.value.query?.price ?? '0');
    if (_price && !Number.isNaN(_price)) {
      price.value = _price.toString();
    }
  },
  {
    deep: true,
  },
);
const modal = useModal();
function onDeposit() {
  const bridgeTokens = network.value.bridge;
  const tokenKey = tokenSymbolList.value[1]
    ?.trim()
    ?.toLowerCase() as keyof typeof bridgeTokens;

  const token = bridgeTokens[tokenKey]?.[1]?.tokens;

  if (token) {
    modal.open(DepositModal, { token });
  }
}

const isBuying = ref(false);
async function onBuy() {
  isBuying.value = true;
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.value.chainId)) {
      const result = await switchNetwork(Number(network.value.chainId));
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
    const order = {
      price: Number(state.price),
      qty: state.quantity!,
      filledQty: 0,
      originalU: Number(state.total!),
      filledU: 0,
      type: 1,
      status: 0,
      txHash: tx.hash,
      time: new Date().getTime().toString(),
      orderId: tx.hash,
      pair: currantToken.value?.value,
      verified: false,
    };
    const qty = quantity.value;
    price.value = undefined;
    quantity.value = undefined;
    toast.promise(tradeApi.checkTransaction(tx.hash), {
      loading: t('sendTransaction'),
      success: () => {
        addOrder(order);
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
      description: `Buy ${qty} BOL`,
      action: {
        label: t('viewTx'),
        onClick: () => {
          window.open(`${network.value.explorer}/tx/${tx.hash}`, '_blank');
        },
      },
    });
  }
  catch (error) {
    handleJsonRpcError(error, toast);
  }
  finally {
    isBuying.value = false;
  }
}

watch(
  () => props.mode,
  async () => {
    quantity.value = undefined;
    if (props.mode === 'limit') {
      price.value = undefined;
    }
    else {
      price.value = data.value?.latestPrice;
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
          <IconInactiveRadio v-else class="size-[16px]" />
          <span
            :class="selectedMode === item.value ? 'text-white' : 'text-[#999]'"
            >{{ item.label }}</span
          >
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
          v-model="price"
          placeholder="0.0"
          :precision="5"
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end !text-white"
        />
        <span class="text-white text-xs"> {{ tokenSymbolList[1] }}</span>
      </div>
    </div>
    <div class="form-item">
      <span>Qty</span>
      <div class="flex justify-end items-center">
        <CustomInput
          v-model="quantity"
          placeholder="0.0"
          :precision="2"
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end !text-white"
        />
        <span class="text-white text-xs"> {{ tokenSymbolList[0] }}</span>
      </div>
    </div>
    <div>
      <AmountSlider v-model:value="amountPercent" />
    </div>
    <div class="form-item">
      <span>Value</span>
      <div class="flex justify-end items-center space-x-[10px]">
        <CustomInput
          v-model="total"
          placeholder="0.0"
          :precision="2"
          type="number"
          input-class="!text-[16px] !bg-transparent !text-end !text-white"
        />
        <span class="text-white text-xs"> {{ tokenSymbolList[1] }}</span>
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-start md:justify-between gap-1 items-end md:items-center !mt-3">
      <div
        v-if="address"
        key="balance"
        class="w-full md:w-fit inline-flex justify-between text-white text-[14px]"
      >
        <span>Balance</span>
        <span class="hidden md:inline">:</span>
        <TokenBalance
          v-if="currantToken?.tokens[1]"
          class="ms-1"
          :address="address"
          :token="currantToken.tokens[1]"
          :config="{ showSymbol: true }"
          @change="(value) => (balance = value)"
        />
      </div>
      <div v-else />
      <UButton
        to=""
        variant="outline"
        size="xs"
        class="rounded-[4px] h-[22px] text-[12px] !px-1"
        @click="onDeposit"
      >
        {{ t("addFund") }}
      </UButton>
    </div>
    <div class="grow" />
    <div class="pt-5 w-full">
      <UButton
        v-if="!address"
        block
        color="gray"
        class="h-[40px] rounded-full border-0 ring-0 text-sm font-normal bg-[#272727]"
        @click="open"
      >
        <span class="text-primary">Connect Wallet</span>
      </UButton>
      <UButton
        v-else
        color="buy"
        block
        class="h-[40px] rounded-full border-0 ring-0 text-sm font-medium"
        :loading="isBuying"
        @click="onBuy"
      >
        Buy Bol
      </UButton>

      <div
        class="flex justify-center items-center mt-2 space-x-[8px] text-[#B0B0B0] text-[14px]"
      >
        <UPopover
          :popper="{ placement: 'top' }"
          mode="hover"
        >
          <IconHelp />
          <template #panel>
            <div class="flex flex-col p-2 text-[12px] space-y-[8px]">
              <span>{{ $t("tradingFeeRate") }}</span>
              <span>{{ $t("maker") }}: 0.00%</span>
              <span>{{ $t("taker") }}: 0.30%</span>
            </div>
          </template>
        </UPopover>
        <span>{{ $t("tradingFee") }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#B0B0B0] rounded-[4px] flex justify-between items-center px-[16px] text-sm font-normal;
  @apply border-[1px] border-[#4D4D4D];
}
</style>
