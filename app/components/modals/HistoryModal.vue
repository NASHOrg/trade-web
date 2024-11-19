<script lang="ts" setup>
import type { BridgeHistory } from '~/types/common';

const { $config } = useNuxtApp();
const { t } = useI18n();
const { history } = useBridgeHistory();
const { address } = useWallet();

const queryparams = ref({
  pageNo: 1,
  pageSize: 5,
  bridgeNo: '32',
});

const { data, status } = useAsyncData<{
  items: BridgeHistory[];
  pageNo: number;
  totalCount: string;
  totalPage: number;
}>(
  'bridge-history-recods',
  async () => {
    const data: any = await $fetch(`${$config.public.bridgeApiUrl}/bool-ultimate-bridge/swap/swap-records`, {
      query: { ...queryparams.value, userAddress: address.value },
    });
    if (data.code === '000') {
      return data.data;
    }
  },
  {
    server: false,
    watch: [() => queryparams.value.pageNo, address],
  },
);
const records = ref<BridgeHistory[]>([]);

async function checkTransactionStatus() {
  if (history.value.length === 0) return;
  const chainId = Array.from(
    new Set(history.value.filter(h => h.swapRecordStatus === 'Pending').map(h => h.swapRecordSrcChainId!)),
  );
  const checkInfos = chainId.map(c => ({
    chainID: c,
    srcChainHash: history.value
      .filter(h => h.swapRecordSrcChainId === c && h.swapRecordStatus === 'Pending')
      .map(h => h.swapRecordSrcChainHash),
  }));
  const result = await $fetch<{
    code: string;
    data: BridgeHistory[];
  }>(`${$config.public.bridgeApiUrl}/bool-ultimate-bridge/swap/swap-record:check`, { method: 'POST', body: { checkInfos } });
  const hashes = result.data.map(d => d.swapRecordSrcChainHash);
  history.value = history.value.filter(
    h => !hashes.includes(h.swapRecordSrcChainHash!),
  );
}

useInfiniteScroll(
  document,
  (state) => {
    if (state.arrivedState.bottom) queryparams.value.pageNo++;
  },
  {
    canLoadMore() {
      if (records.value.length === 0 && queryparams.value.pageNo === 1) return false;
      if (status.value !== 'success') return false;
      return data?.value?.totalPage !== undefined
        ? data.value.pageNo < data?.value?.totalPage
        : true;
    },
    distance: 4,
  },
);

watchOnce(history, checkTransactionStatus, { immediate: true });
</script>

<template>
  <BasicModal
    :title="t('history')"
    :prevent-close="true"
  >
    <div class="flex flex-col w-full md:space-y-6 space-y-[10px] px-[14px] md:px-[24px]">
      <div
        v-if="status === 'pending' && records.length === 0"
        class="w-full my-[100px] flex flex-col justify-center items-center"
      >
        <UIcon
          class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
          name="quill:loading-spin"
        />
      </div>
      <img
        v-else-if="Number(data?.totalCount) === 0"
        class="my-[50px] flex justify-center size-[72px] mx-auto"
        src="/images/empty_box.png"
      >
      <template v-else>
        <HistoryCard
          v-for="item in history"
          :key="item.swapRecordSrcChainHash"
          :record="item"
        />
        <HistoryCard
          v-for="item in data?.items ?? []"
          :key="item.swapRecordSrcChainHash"
          :record="item"
        />
      </template>
      <div
        v-if="status === 'pending' && records.length > 0"
        class="flex justify-center my-auto py-2"
      >
        <UIcon
          class="animate-spin text-primary-500 w-6 h-6"
          name="quill:loading-spin"
        />
      </div>
      <TablePagination
        v-if="data && data.totalPage > 1"
        v-model:current="queryparams.pageNo"
        class="mt-[30px] mx-auto border-[#2e2e2e]"
        :total="data?.totalPage ?? 1"
        :disabled="status === 'pending'"
      />
    </div>
  </BasicModal>
</template>
