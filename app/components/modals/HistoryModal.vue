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

const { counter } = useInterval(10000, { controls: true });
const { data, status, refresh } = useAsyncData<{
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
  if (hashes.length > 0 && queryparams.value.pageNo === 1) {
    refresh();
  }
  history.value = history.value.filter(
    h => !hashes.includes(h.swapRecordSrcChainHash!),
  );
}

watch(counter, () => {
  checkTransactionStatus();
});

const records = computed(() => {
  return [...history.value, ...(data.value?.items ?? [])];
});

watchOnce(history, checkTransactionStatus, { immediate: true });
</script>

<template>
  <BasicModal
    :title="t('history')"
    :prevent-close="true"
  >
    <div class="flex flex-col w-full md:space-y-6 space-y-[10px] px-[14px] md:px-[24px]">
      <div
        v-if="status === 'pending'"
        class="w-full my-[100px] flex flex-col justify-center items-center"
      >
        <UIcon
          class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
          name="quill:loading-spin"
        />
      </div>
      <div
        v-else-if="records.length === 0"
        class="my-[50px] flex flex-col justify-center mx-auto items-center"
      >
        <img
          class="size-[72px]"
          src="/images/empty_box.png"
        >
        <div class="text-sm font-medium text-gray-500">
          {{ t('noTransactions') }}
        </div>
      </div>
      <template v-else>
        <template v-if="queryparams.pageNo === 1">
          <HistoryCard
            v-for="item in history"
            :key="item.swapRecordSrcChainHash"
            :record="item"
          />
        </template>
        <HistoryCard
          v-for="item in data?.items ?? []"
          :key="item.swapRecordSrcChainHash"
          :record="item"
        />
      </template>
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
