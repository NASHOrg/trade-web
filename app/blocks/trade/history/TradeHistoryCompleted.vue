<script setup lang="ts">
const { $api } = useNuxtApp();
const { t } = useI18n();
const columns = computed(() => {
  return [
    // {
    //   key: 'id',
    //   label: 'ID',
    // },
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
      label: t('price'),
    },
    {
      key: 'qty',
      label: t('totalQty'),
    },
    {
      key: 'time',
      label: t('time'),
    },
  ];
});
const { address } = useWallet();
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
});

const { data, status } = useAsyncData(
  `trade-history-${address}`,
  () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.blockchainTradeHistory({
      ...queryParams.value,
      address: address.value,
    });
  },
  {
    watch: [address, queryParams],
    immediate: true,
    server: false,
  },
);
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div
      v-if="!data && status === 'pending'"
      class="my-[78px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <NuxtPicture
      v-else-if="data && Number(data.totalCount) === 0"
      class="my-[50px] flex justify-center"
      src="images/empty_box.png"
      densities="1x 2x"
      height="68"
      width="80"
    />
    <UTable
      v-else-if="data"
      class="w-full"
      :columns="columns"
      :rows="data?.items ?? []"
    >
      <template #type-data="{ row }">
        <div>
          <span v-if="row.type === 0">{{ t("sell") }}</span>
          <span v-else>{{ t("buy") }}</span>
        </div>
      </template>
      <template #time-data="{ row }">
        {{ formatDate(Number(row.tradeTime)) }}
      </template>
    </UTable>
    <TablePagination
      v-if="data && data.totalPage > 0"
      class="mt-[30px]"
      :total="data.totalPage"
      :current="data.pageNo"
      :disabled="status === 'pending'"
      @change="
        (value) => {
          queryParams.pageNo = value;
        }
      "
    />
  </div>
</template>
