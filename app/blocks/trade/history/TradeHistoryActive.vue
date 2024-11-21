<script setup lang="ts">
import { toast } from 'vue-sonner';

const { address, chainId, switchNetwork, open } = useWallet();
const { network, tradeApi, pairs } = useNetworkConfig();
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

const columns = computed(() => [
  {
    key: 'time',
    label: t('time'),
  },
  {
    key: 'pairLabel',
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
]);

const smColumns = computed(() => [
  {
    key: 'time',
    label: t('time'),
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
]);

const datas = computed(() => {
  const localOrders = orders.value.filter(o => !data.value?.items.map(i => i.txHash).includes(o.txHash));
  const userOrders = [...localOrders, ...(data.value?.items ?? [])];
  const _orders = userOrders.filter(o => !cancelledOrders.value.includes(o.txHash));
  return _orders.map((o) => {
    const pair = pairs.find(p => p.value === o.pair)!;
    const price = formatAmount(o.price.toString(), 5, { format: true });
    const qty = `${formatAmount(o.filledQty.toString(), 2, { format: true })}/${formatAmount(o.qty.toString(), 2, { format: true })}`;
    const value = `${formatAmount(o.filledU.toString(), 2, { format: true })}/${formatAmount(o.originalU.toString(), 2, { format: true })}`;
    const time = formatDate(o.time);
    return {
      ...o,
      pair: pair,
      pairLabel: pair.label,
      price,
      qty,
      value,
      time,
    };
  });
});

watch(data, () => {
  if (data.value?.items) {
    const finished = data?.value.items.map(i => i.txHash) ?? [];
    removeOrders(finished);
  }
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
  const completed = result!.filter(t => t.result).map(t => t.hash);
  removeOrders(completed);
}

const isCanceling = ref<string[]>([]);
async function onCancelOrder(id: string, type: number, hash: string) {
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== network.chainId) {
      const result = await switchNetwork(network.chainId);
      if (!result) return;
    }
    isCanceling.value.push(hash);
    const tx = await tradeApi.cancelOrder(provider, {
      type: type === 0 ? 'sell' : 'buy',
      orderId: BigInt(id),
    });
    toast.promise(tradeApi.checkTransaction(tx.hash), {
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
          window.open(`${network.explorer}/tx/${tx.hash}`, '_blank');
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
      v-if="!data && status === 'pending'"
      class="my-[78px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <div
      v-else-if="datas.length === 0"
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
        {{ t('noTransactions') }}
      </div>
    </div>
    <template v-else>
      <div
        v-for="item in datas"
        :key="item.txHash"
        class="md:hidden mt-[10px] p-[16px] w-full flex flex-col space-y-[14px] border-b border-[#eaeaaea] dark:border-[#2e2e2e] last:border-b-0"
      >
        <div class="flex justify-between">
          <div class="flex space-x-[8px] items-center">
            <UAvatarGroup
              size="sm"
              :max="2"
            >
              <UAvatar
                :src="item.pair.tokens[0]!.icon"
                :alt="item.pair.tokens[0]!.symbol"
                :ui="{
                  size: { sm: 'size-[20px]' },
                }
                "
              />
              <UAvatar
                :src="item.pair.tokens[1]!.icon"
                :ui="{
                  size: { sm: 'size-[20px]' },
                }"
                :alt="item.pair.tokens[1]!.symbol"
              />
            </UAvatarGroup>
            <span>{{ item.pairLabel }}</span>
            <span
              class="rounded-[3px] px-[4px] py-[2px]"
              :class="item.type === 1 ? 'text-buy bg-buy-300/10 dark:bg-buy-600/30' : 'text-sell bg-sell-300/10 dark:bg-sell-600/30'"
            >
              {{ item.type === 1 ? t('buy') : t('sell') }}
            </span>
          </div>

          <UButton
            class="rounded-[4px] h-[26px]"
            size="sm"
            :disabled="item.verified === false"
            :loading="isCanceling.includes(item.txHash)"
            @click="onCancelOrder(item.orderId, item.type, item.txHash)"
          >
            <span v-if="!isCanceling.includes(item.txHash)">
              {{ t("cancel") }}
            </span>
          </UButton>
        </div>
        <div
          v-for="row in smColumns"
          :key="row.key"
          class="flex justify-between w-full text-[14px]"
        >
          <span class="text-[#999]">{{ row.label }}</span>
          <span>{{ item[row.key] }}</span>
        </div>
      </div>
      <UTable
        v-model:expand="expandRows"
        class="hidden md:block w-full mt-2.5"
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
    </template>

    <TablePagination
      v-if="data && data.totalPage > 1"
      v-model:current="queryParams.pageNo"
      class="mt-[30px]"
      :total="data?.totalPage ?? 1"
      :disabled="status === 'pending'"
    />
  </div>
</template>
