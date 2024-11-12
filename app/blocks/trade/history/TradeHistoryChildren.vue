<script lang="ts" setup>
import type { BlockchainTradeHistory } from "~/types/swagger";

const props = defineProps<{
  trade: BlockchainTradeHistory["items"][number];
}>();
const { $api } = useNuxtApp();
const { t } = useI18n();

const columns = computed(() => {
  return [
    {
      key: "1",
    },
    {
      key: "time",
      label: t("time"),
    },
    {
      key: "pair",
      label: t("pair"),
    },
    {
      key: "type",
      label: t("side"),
    },
    {
      key: "price",
      label: t("price"),
    },
    {
      key: "qty",
      label: t("totalQty"),
    },
    {
      key: "u",
      label: t("value"),
    },
    {
      key: "2",
    },
  ];
});

const queryParams = ref({
  pageNo: 1,
  pageSize: 100,
});

const { data, status } = useAsyncData(
  `trade-${props.trade.orderId}`,
  () =>
    $api.blockchainTradeHistoryDetail({
      ...queryParams.value,
      type: props.trade.type.toString(),
      orderId: props.trade.orderId,
    }),
  {
    server: false,
  },
);

const datas = computed(() => {
  return (data.value?.items ?? []).map((item) => {
    return {
      ...item,
      price: formatAmount(item.price || "0", 2),
      qty: formatAmount(item.qty || "0", 2),
      u: formatAmount(item.u.toString(), 2),
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
      <span class="text-sm font-medium text-gray-400">Loading...</span>
    </div>
    <div v-else-if="data && Number(data.totalCount) === 0" class="my-[50px]">
      <NuxtPicture
        class="mb-4 flex justify-center"
        src="images/empty_box.png"
        densities="1x 2x"
        height="72"
        width="72"
      />
      <div class="text-sm font-medium text-gray-500">No transactions</div>
    </div>
    <UTable
      v-else
      by="orderId"
      class="w-full"
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
            v-for="count in columns.length + 1"
            :key="count"
            :style="{
              width: [1, columns.length + 1, columns.length].includes(count)
                ? '5%'
                : `${(1 / (columns.length - 2)) * 85}%`,
            }"
            :data-index="count"
          />
        </colgroup>
      </template>

      <template #type-data="{ row }">
        <div>
          <span v-if="row.type === 0" class="text-sell">{{ t("sell") }}</span>
          <span v-else class="text-buy">{{ t("buy") }}</span>
        </div>
      </template>

      <template #time-data="{ row }">
        <span> {{ formatDate(Number(row.tradeTime)) }}</span>
      </template>
    </UTable>
  </div>
</template>
