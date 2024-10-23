<script setup lang="ts">
const { $api } = useNuxtApp();

const columns = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'User name',
  },
  {
    key: 'title',
    label: 'Job position',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'role',
  },
];
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
    <UTable
      v-if="data"
      class="w-full"
      :columns="columns"
      :rows="data?.items ?? []"
    />
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
