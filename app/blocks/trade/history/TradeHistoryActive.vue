<script setup lang="ts">
import { toast } from 'vue-sonner';
import { tradeApi } from '~/utils/contracts';

const { address, chainId, switchNetwork } = useWallet();
const { $api } = useNuxtApp();
const { network } = useNetworkConfig();
const { t } = useI18n();
const columns = [
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
    label: t('targetPrice'),
  },
  {
    key: 'filledQty',
    label: t('filledQty'),
  },
  {
    key: 'qty',
    label: t('totalQty'),
  },
  {
    key: 'action',
    label: t('action'),
  },
];

const queryparams = ref({
  pageNo: 1,
  pageSize: 10,
});

const { data, status } = useAsyncData(
  `trade-orders-${address}`,
  () => {
    if (!address.value) return Promise.resolve(undefined);
    return $api.blockchainUserOrders({
      address: address.value,
      ...queryparams.value,
    });
  },
  {
    watch: [address, () => queryparams.value.pageNo],
    immediate: true,
    server: false,
  },
);

const isCanceling = ref<string | undefined>(undefined);
async function onCancelOrder(id: string, type: number) {
  isCanceling.value = id + type.toString();
  try {
    if (!address.value) {
      return open();
    }
    const provider = useWallet().provider();
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    const tx = await tradeApi.cancelOrder(provider, {
      type: type === 0 ? 'sell' : 'buy',
      orderId: BigInt(id),
    });
    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
    });
  }
  catch (error) {
    handleJsonRpcError(error, toast);
  }
  finally {
    isCanceling.value = undefined;
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div
      v-if="status === 'pending' || !data"
      class="my-[50px] w-[68px] h-[68px] flex flex-col justify-center items-center"
    >
      <UIcon
        class="animate-spin text-primary-500 w-6 h-6 flex justify-center"
        name="quill:loading-spin"
      />
    </div>
    <NuxtPicture
      v-else-if="Number(data.totalCount) === 0"
      class="my-[50px] flex justify-center"
      src="images/empty_box.png"
      densities="1x 2x"
      height="68"
      width="80"
    />
    <UTable
      v-else
      class="w-full"
      :columns="columns"
      :rows="data.items"
    >
      <template #action-data="{ row }">
        <UButton
          class="rounded-[4px]"
          size="sm"
          :loading="isCanceling === row.orderId + row.type.toString()"
          @click="onCancelOrder(row.orderId, row.type)"
        >
          <span v-if="isCanceling !== row.orderId + row.type.toString()">
            {{ t("cancel") }}
          </span>
        </UButton>
      </template>
      <template #type-data="{ row }">
        <div>
          <span v-if="row.type === 0">{{ t("sell") }}</span>
          <span v-else>{{ t("buy") }}</span>
        </div>
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
          queryparams.pageNo = value;
        }
      "
    />
  </div>
</template>
