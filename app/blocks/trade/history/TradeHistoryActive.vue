<script setup lang="ts">
import { toast } from 'vue-sonner';
import { tradeApi } from '~/utils/contracts';

// const tradeStore = useTradeStore();

// const { currantToken } = storeToRefs(tradeStore);
const { address, chainId, switchNetwork, open } = useWallet();
const { network } = useNetworkConfig();
const { t } = useI18n();
const { $api } = useNuxtApp();
const userStore = useUserStore();

const isCanceling = ref<string | undefined>(undefined);

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
});

const { data, status } = useAsyncData(
  `trade-orders-${address}`,
  () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.blockchainUserOrders(
      {
        address: address.value,
        ...queryParams.value,
      },
      userStore.token,
    );
  },
  {
    watch: [address, () => queryParams.value.pageNo],
    immediate: true,
    server: false,
    deep: true,
  },
);

const columns = computed(() => {
  return [
    {
      key: 'pair',
      label: t('pair'),
    },
    {
      key: 'type',
      label: t('side'),
    },
    {
      key: 'price',
      label: t('targetPrice'),
    },
    {
      key: 'filledQty',
      label: t('filledQty'),
    },
    {
      key: 'qty',
      label: t('totalQty'),
    },
    {
      key: 'action',
      label: t('action'),
    },
  ];
});

async function onCancelOrder(id: string, type: number) {
  isCanceling.value = id + type.toString();
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    const tx = await tradeApi.cancelOrder(provider, {
      type: type === 0 ? 'sell' : 'buy',
      orderId: BigInt(id),
    });
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
    isCanceling.value = undefined;
  }
}
</script>

<template>
  <div class="w-full max-w-[1663px] mx-auto flex flex-col items-center">
    <div
      v-if="!address"
      class="mt-[100px] flex items-center justify-center text-sm text-primary font-medium text-center"
    >
      <UButton
        block
        color="gray"
        class="h-[40px] px-10 rounded-full border-0 ring-0 text-sm font-normal bg-[#272727]"
        @click="open"
      >
        <span class="text-primary"> Connect Wallet</span>
      </UButton>
    </div>
    <div
      v-else-if="!data && status === 'pending'"
      class="my-[78px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <div
      v-else-if="!data || (data?.items ?? []).length === 0"
      class="my-[50px]"
    >
      <NuxtPicture
        class="mb-4 flex justify-center"
        src="images/empty_box.png"
        densities="1x 2x"
        height="68"
        width="80"
      />
      <div class="text-sm font-medium text-gray-500">
        No transactions
      </div>
    </div>
    <UTable
      v-else
      class="w-full mt-2.5"
      :columns="columns"
      :rows="data.items ?? []"
      :ui="{ th: { base: 'w-1/6' }, td: { base: 'w-1/6' } }"
    >
      <template #action-data="{ row }">
        <UButton
          class="rounded-[4px] h-[26px]"
          size="sm"
          :loading="isCanceling === row.orderId + row.type.toString()"
          @click="onCancelOrder(row.orderId, row.type)"
        >
          <span v-if="isCanceling !== row.orderId + row.type.toString()">
            {{ t("cancel") }}
          </span>
        </UButton>
      </template>
      <template #type-data="{ row }">
        <div>
          <span
            v-if="row.type === 0"
            class="text-sell"
          >{{ t("sell") }}</span>
          <span
            v-else
            class="text-buy"
          >{{ t("buy") }}</span>
        </div>
      </template>
    </UTable>

    <TablePagination
      v-if="data && data.totalPage > 1"
      v-model:current="queryParams.pageNo"
      class="mt-[30px]"
      :total="data?.totalPage ?? 1"
      :disabled="status === 'pending'"
    />
  </div>
</template>
