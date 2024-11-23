<script setup lang="ts">
const { $api } = useNuxtApp();
const { t } = useI18n();
const { pairs } = useNetworkConfig();
const { address } = useWallet();
const { counter } = useInterval(10000, { controls: true });

const columns = computed(() => {
  return [
    {
      key: 'status',
    },
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
      key: 'fee',
      label: t('fee'),
    },
    {
      key: 'expand',
    },
    {
      key: 'action',
    },
  ];
});

const smColumns = computed(() => {
  return [
    {
      key: 'time',
      label: t('orderTime'),
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
      label: t('totalValue'),
    },
    {
      key: 'fee',
      label: t('fee'),
    },
  ];
});

const expanded = ref<string>('');

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
  const records = data.value?.items ?? [];
  return records.map((r) => {
    const pair = pairs.find(p => p.value === r.pair)!;
    return {
      ...r,
      pair,
      pairLabel: pair.label,
      time: formatDate(r.tradeTime),
      qty: formatAmount(r.qty, 2, { format: true }),
      price: formatAmount(r.price || '0', 5, { format: true }),
      u: formatAmount(r.u, 2, { format: true }),
      fee: formatAmount(r.fee, 2, { format: true }),
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
    item => item.orderId + item.type === row.orderId + row.type,
  );
}
</script>

<template>
  <div class="w-full flex flex-col items-center select-none">
    <div
      v-if="status === 'pending' && (!data || queryParams.pageNo > 1)"
      class="my-[78px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <div
      v-else-if="Number(data?.totalCount ?? 0) === 0"
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
        :key="item.orderId"
        class="md:hidden mt-[10px] p-[16px] w-full flex flex-col space-y-[14px] border-b border-[#eaeaaea] dark:border-[#2e2e2e] last:border-b-0"
        @click="expanded === (item.orderId+item.type) ? expanded = '' : expanded = (item.orderId+item.type)"
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
          <UBadge
            v-if="item.status === 1"
            color="green"
            variant="outline"
            class="w-[105px] justify-center h-[24px]"
            :ui="{ variant: { outline: 'bg-green-500/10' } }"
          >
            {{ t('fullMatched') }}
          </UBadge>
          <UBadge
            v-else-if="item.status === 2"
            color="primary"
            variant="outline"
            class="w-[105px] justify-center h-[24px]"
            :ui="{ variant: { outline: 'bg-primary-500/10' } }"
          >
            {{ t('partlyMatched') }}
          </UBadge>
          <UBadge
            v-else-if="item.status === -1"
            color="sell"
            variant="outline"
            class="w-[105px] justify-center"
            :ui="{ variant: { outline: 'bg-sell-500/10' } }"
          >
            {{ t('canceled') }}
          </UBadge>
        </div>
        <div
          v-for="row in smColumns"
          :key="row.key"
          class="flex justify-between w-full text-[14px]"
        >
          <span class="text-[#999]">{{ row.label }}</span>
          <span>{{ item[row.key] }}</span>
        </div>
        <TradeHistoryChildren
          v-if="item.orderId+item.type === expanded"
          :trade="{ type: item.type.toString(), orderId: item.orderId }"
        />
        <IconArrowDown
          class="transition-transform w-[12px] mx-auto cursor-pointer"
          :class="{ 'rotate-180': item.orderId === expanded } "
        />
      </div>
      <UTable
        v-model:expand="expandRows"
        :by="(a:any, z:any) => a.orderId+a.type === z.orderId+z.type"
        class="hidden md:block w-full"
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
        <template #status-data="{ row }">
          <UBadge
            v-if="row['status'] === 1"
            color="green"
            variant="outline"
            class="w-[105px] justify-center"
            :ui="{ variant: { outline: 'bg-green-500/10' } }"
          >
            {{ t('fullMatched') }}
          </UBadge>
          <UBadge
            v-else-if="row['status'] === 2"
            color="primary"
            variant="outline"
            class="w-[105px] justify-center"
            :ui="{ variant: { outline: 'bg-primary-500/10' } }"
          >
            {{ t('partlyMatched') }}
          </UBadge>
          <UBadge
            v-else-if="row['status'] === -1"
            color="sell"
            variant="outline"
            class="w-[105px] justify-center"
            :ui="{ variant: { outline: 'bg-sell-500/10' } }"
          >
            {{ t('canceled') }}
          </UBadge>
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
