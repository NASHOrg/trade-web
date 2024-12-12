<script lang="ts" setup>
const props = defineProps<{
  trade: {
    type: string;
    orderId: string;
    pair: string;
  };
}>();
const { $api } = useNuxtApp();
const { t } = useI18n();

const columns = computed(() => {
  return [
    {
      key: '1',
    },
    {
      key: '2',
    },
    {
      key: 'time',
      label: t('time'),
    },
    {
      key: '3',
    },
    {
      key: '4',
    },
    {
      key: 'price',
      label: t('price'),
    },
    {
      key: 'qty',
      label: t('qty'),
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
      key: '2',
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
      label: t('time'),
    },
    {
      key: 'price',
      label: t('price'),
    },
    {
      key: 'qty',
      label: t('qty'),
    },
    {
      key: 'u',
      label: t('value'),
    },
    {
      key: 'fee',
      label: t('fee'),
    },
  ];
});

const queryParams = ref({
  pageNo: 1,
  pageSize: 100,
});

const { data, status } = useAsyncData(
  `trade-${props.trade.orderId}-${props.trade.type}`,
  () =>
    $api.blockchainTradeHistoryDetail({
      ...queryParams.value,
      type: props.trade.type.toString(),
      orderId: props.trade.orderId,
      pair: props.trade.pair,
    }),
  {
    server: false,
  },
);

const datas = computed(() => {
  return (data.value?.items ?? []).map((item) => {
    return {
      ...item,
      time: formatDate(item.tradeTime),
      price: formatAmount(item.price || '0', 5, { format: true }),
      qty: formatAmount(item.qty || '0', 2, { format: true }),
      u: formatAmount(item.u.toString(), 2, { format: true }),
      fee: formatAmount(item.fee.toString(), 2, { format: true }),
    };
  });
});
</script>

<template>
  <div
    class="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800/30"
  >
    <div
      v-if="!data && status === 'pending'"
      class="h-[48px] w-full flex justify-center items-center space-x-2 px-4"
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
        {{ t('noTransactions') }}
      </div>
    </div>
    <template v-else>
      <div class="md:hidden flex flex-col space-y-[14px] w-full">
        <div
          v-for="item in datas"
          :key="item.orderId"
          class="space-y-[16px] bg-[#F1F1F3] dark:bg-[#171717] border border-[#d5d5d5] dark:border-[#2e2e2e] rounded-[6px] p-[16px]"
        >
          <div
            v-for="row in smColumns"
            :key="row.key"
            class="flex justify-between w-full text-[14px]"
          >
            <span class="text-[#999]">{{ row.label }}</span>
            <span>{{ item[row.key] }}</span>
          </div>
        </div>
      </div>
      <UTable
        by="orderId"
        class="hidden md:block w-full"
        :columns="columns"
        :rows="datas"
        :ui="{
          tbody: 'divide-none',
          divide: 'divide-none',
        }"
      >
        <template #caption>
          <colgroup>
            <col
              v-for="count in columns.length"
              :key="count"
              :style="{
                width: [1, columns.length - 1, columns.length].includes(count)
                  ? '5%'
                  : `${(1 / (columns.length - 3)) * 85}%`,
              }"
              :data-index="count"
            >
          </colgroup>
        </template>
      </UTable>
    </template>
  </div>
</template>
