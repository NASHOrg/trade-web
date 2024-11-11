<script setup lang="ts">
const { $api } = useNuxtApp();
const { t } = useI18n();
const { open, address } = useWallet();
const { counter } = useInterval(10000, { controls: true });

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
      label: t('avgPrice'),
    },
    {
      key: 'qty',
      label: t('totalQty'),
    },
    {
      key: 'u',
      label: t('value'),
    },
    {
      key: 'expand',
    },
    {
      key: 'action',
    },
  ];
});

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
});

const { data, status, refresh } = useAsyncData(
  `trade-history-${address}-${queryParams.value.pageNo}`,
  () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.blockchainTradeHistory({
      ...queryParams.value,
      address: address.value,
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
  if (queryParams.value.pageNo === 1) {
    refresh();
  }
});

const datas = computed(() => {
  return (data.value?.items ?? []).map((item) => {
    return {
      ...item,
      price: formatAmount(item.price || '0', 2),
      qty: formatAmount(item.qty || '0', 2),
      u: formatAmount(item.u, 2),
    };
  });
});

const expandRows = ref<{
  openedRows: typeof datas.value;
  row: (typeof datas.value)[number] | null;
}>({
      openedRows: [],
      row: null,
    });

function onSelect(info: (typeof datas.value)[number]) {
  const index = expandRows.value.openedRows.findIndex(
    item => item['orderId'] === info['orderId'],
  );
  if (index !== -1) {
    expandRows.value.openedRows = [];
  }
  else {
    expandRows.value.openedRows = [info];

    // expandRows.value.openedRows.push();
  }
}

function isExpanded(row: (typeof datas.value)[number]) {
  return expandRows.value.openedRows.some(
    item => item.orderId === row.orderId,
  );
}
</script>

<template>
  <div class="w-full flex flex-col items-center select-none">
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
      v-else-if="data && Number(data.totalCount) === 0"
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
      v-else-if="datas.length > 0"
      v-model:expand="expandRows"
      by="orderId"
      class="w-full"
      :columns="columns"
      :rows="datas"
      @select="onSelect"
    >
      <template #caption>
        <colgroup>
          <col
            v-for="count in columns.length + 1"
            :key="count"
            :style="{
              width: [1, columns.length + 1, columns.length].includes(count)
                ? '5%'
                : `${(1 / (columns.length - 2)) * 85}%`,
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

      <template #expand="{ row }">
        <TradeHistoryChildren :trade="row" />
      </template>

      <template #time-data="{ row }">
        <span> {{ formatDate(Number(row.tradeTime)) }}</span>
      </template>

      <template #expand-data="{ row }">
        <div class="flex items-center space-x-2">
          <UIcon
            name="i-heroicons-chevron-down"
            :class="{ 'rotate-180 transition-[0.3s]': isExpanded(row) }"
          />
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
