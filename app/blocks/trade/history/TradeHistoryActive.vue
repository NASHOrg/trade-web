<script setup lang="ts">
import { toast } from 'vue-sonner';

// const tradeStore = useTradeStore();

// const { currantToken } = storeToRefs(tradeStore);
const { address, chainId, switchNetwork, open } = useWallet();
const { network, tradeApi } = useNetworkConfig();
const { t } = useI18n();
const { $api } = useNuxtApp();
const { counter } = useInterval(10000, { controls: true });
const { cancelledOrders, orders, addCancelledOrder, removeOrders } = useOrders();

const queryParams = ref({
  pageNo: 1,
  pageSize: 100,
});

const { data, status, refresh } = useAsyncData(
  `trade-orders-${address}`,
  () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.blockchainUserOrders({
      address: address.value,
      ...queryParams.value,
    });
  },
  {
    watch: [address, () => queryParams.value.pageNo],
    immediate: true,
    server: false,
    deep: true,
  },
);

watch(counter, () => {
  checkOrders();
  if (queryParams.value.pageNo === 1) {
    refresh();
  }
});

const columns = computed(() => {
  return [
    {
      key: 'time',
      label: t('time'),
    },
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
      key: 'qty',
      label: `${t('filled')}/${t('totalQty')}`,
    },
    {
      key: 'value',
      label: `${t('filled')}/${t('totalValue')}`,
    },
    {
      key: 'action',
      label: t('action'),
    },

    {
      key: '1',
    },
  ];
});

const datas = computed(() => {
  const localOrders = orders.value.filter(o => !data.value?.items.map(i => i.txHash).includes(o.txHash));
  const userOrders = [...localOrders, ...(data.value?.items ?? [])];
  return userOrders.filter(o => !cancelledOrders.value.includes(o.txHash));
});

const expandRows = ref<{
  openedRows: typeof datas.value;
  row: (typeof datas.value)[number] | null;
}>({
      openedRows: [],
      row: null,
    });

async function checkOrders() {
  if (orders.value.length === 0) return;
  const result = await $api.blockchainCheckOrder(
    {
      hash: orders.value.map(o => o.txHash).join(','),
    },
  );
  const uncompleted = result!.filter(t => !t.result).map(t => t.hash);
  removeOrders(uncompleted);
}

const isCanceling = ref<string[]>([]);
async function onCancelOrder(id: string, type: number, hash: string) {
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.value.chainId)) {
      const result = await switchNetwork(Number(network.value.chainId));
      if (!result) return;
    }
    isCanceling.value.push(hash);
    const tx = await tradeApi.cancelOrder(provider, {
      type: type === 0 ? 'sell' : 'buy',
      orderId: BigInt(id),
    });
    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        addCancelledOrder(hash);
        return t('transactionSuccess');
      },
      error: () => {
        isCanceling.value = isCanceling.value.filter(i => i !== hash);
        return t('transactionFail');
      },
      description: 'Cancel order',
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
    isCanceling.value = isCanceling.value.filter(i => i !== hash);
  }
}

onMounted(() => {
  checkOrders();
});
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
        height="72"
        width="72"
      />
      <div class="text-sm font-medium text-gray-500">
        No transactions
      </div>
    </div>
    <UTable
      v-else
      v-model:expand="expandRows"
      class="w-full mt-2.5"
      :columns="columns"
      :rows="datas"
    >
      <template #caption>
        <colgroup>
          <col
            v-for="count in columns.length + 1"
            :key="count"
            :style="{
              width: [1, columns.length + 1].includes(count)
                ? '5%'
                : `${(1 / (columns.length - 1)) * 90}%`,
            }"
            :data-index="count"
          >
        </colgroup>
      </template>
      <template #expand-action>
        <span />
      </template>

      <template #qty-data="{ row }">
        <span>{{ formatAmount(row["filledQty"], 2) }}</span>
        <span>/</span>
        <span>{{ formatAmount(row["qty"], 2) }}</span>
      </template>
      <template #value-data="{ row }">
        <span>{{ formatAmount(row["filledU"], 2) }}</span>
        <span>/</span>
        <span>{{ formatAmount(row["originalU"], 2) }}</span>
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

      <template #time-data="{ row }">
        <span> {{ formatDate(Number(row.time)) }}</span>
      </template>

      <template #action-data="{ row }">
        <UButton
          class="rounded-[4px] h-[26px]"
          size="sm"
          :disabled="row.verified === false"
          :loading="isCanceling.includes(row.txHash)"
          @click="onCancelOrder(row.orderId, row.type, row.txHash)"
        >
          <span v-if="!isCanceling.includes(row.txHash)">
            {{ t("cancel") }}
          </span>
        </UButton>
      </template>
      <!--
      <template #expand-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-chevron-down"
            :class="{ 'rotate-180 transition-[0.3s]': isExpanded(row) }"
          />
        </div>
      </template> -->
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
