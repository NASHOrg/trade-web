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
