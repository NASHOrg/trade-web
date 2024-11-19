<script setup lang="ts">
import type { BridgeHistory } from '~/types/common';

const { history } = useBridgeHistory();
const { $config } = useNuxtApp();
const { counter } = useInterval(10000, { controls: true });

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

watch(counter, () => {
  checkTransactionStatus();
});
</script>

<template>
  <UChip
    :show="history.length > 0"
    :text="history.length"
    size="2xl"
    class="text-white"
  >
    <slot />
  </UChip>
</template>
