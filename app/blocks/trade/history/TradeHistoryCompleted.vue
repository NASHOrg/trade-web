<script setup lang="ts">
const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'name',
  label: 'User name',
}, {
  key: 'title',
  label: 'Job position',
}, {
  key: 'email',
  label: 'Email',
}, {
  key: 'role',
}];
const { address } = useWallet();
const queryparams = ref({
  pageNo: 1,
  pageSize: 10,
});

const { data } = useAsyncData(`trade-history-${address}`, () => {
  if (!address.value) return Promise.resolve(undefined);
}, {
  watch: [address, queryparams], immediate: true, server: false,
});
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <UTable
      v-if="data"
      class="w-full"
      :columns="columns"
      :rows="data.items"
    />
    <TablePagination
      class="mt-[30px]"
      :total="10"
      :current="1"
    />
  </div>
</template>
