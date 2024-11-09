<script setup lang="ts">
import { formatUnits } from 'ethers';
import { BaseEvmApi } from '~/utils/contracts/api';

const props = defineProps<{
  address?: string;
  token: { address?: string; decimals?: number; symbol?: string };
  config?: { showSymbol: boolean };
}>();
const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const { network } = useNetworkConfig();
const api = new BaseEvmApi(network.value.rpc);

const { data: balance } = useAsyncData(
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
  if (props.config?.showSymbol) {
    return (
      formatAmount(formatUnits(balance.value!, props.token.decimals), 2)
      + ' '
      + props.token.symbol
    );
  }
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
  <div>
    <div
      v-if="balance === undefined"
      class="min-w-[40px]"
    >
      <USkeleton class="w-full h-[14px]" />
    </div>
    <div v-else>
      {{ formatedBalance }}
    </div>
  </div>
</template>
