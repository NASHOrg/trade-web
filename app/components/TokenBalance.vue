<script setup lang="ts">
import { formatUnits } from 'ethers';
import { BaseEvmApi } from '~/utils/contracts/api';

const props = defineProps<{
  address?: string;
  token: { address?: string; decimals?: number; symbol?: string };
  config?: { showSymbol: boolean; refresh: boolean };
}>();
const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const { network } = useNetworkConfig();
const api = new BaseEvmApi(network.rpc);

const { data: balance, status, refresh: refreshBalance } = useAsyncData(
  `token-balance-${props.address}-${props.token.address ?? ''}`,
  () => {
    if (!props.address) {
      return Promise.resolve(undefined);
    }
    return api.getBalance({
      address: props.address,
      contractAddress: props.token.address,
    });
  },
  { watch: [() => props.address], immediate: true, server: false },
);

const formatedBalance = computed(() => {
  if (balance.value === undefined) return '';
  return formatAmount(formatUnits(balance.value!, props.token.decimals), 2);
});

watch(
  balance,
  () => {
    if (balance.value !== undefined) {
      emit('change', formatUnits(balance.value, props.token.decimals));
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="inline-flex items-center">
    <div
      v-if="status === 'pending'"
      class="min-w-[40px]"
    >
      <USkeleton class="w-full h-[14px]" />
    </div>
    <div v-else>
      {{ formatedBalance }}
    </div>
    <span v-if="config?.showSymbol">
      {{ props.token.symbol }}
    </span>
    <div
      v-if="config?.refresh"
      class="cursor-pointer text-primary inline-flex items-center"
      @click="() => refreshBalance()"
    >
      <UIcon
        name="i-ic-round-refresh"
        size="14"
        :class="{ 'animate-spin': status === 'pending' }"
      />
    </div>
  </div>
</template>
