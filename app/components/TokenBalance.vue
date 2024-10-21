<script setup lang="ts">
import { formatUnits } from 'ethers';
import { stakeApi } from '~/utils/contracts';

const props = defineProps<{ address?: string; token: { address?: string; decimals?: number; symbol?: string } }>();
const emit = defineEmits<{
  (e: 'change', value: bigint): void;
}>();

const { data: balance } = useAsyncData(
  `token-balance-${props.address}-${props.token.address ?? ''}`,
  () => {
    if (!props.address) {
      return Promise.resolve(undefined);
    }
    return stakeApi.getBalance({
      address: props.address,
      contractAddress: props.token.address,
    });
  },
  { watch: [() => props.address], immediate: true, server: false },
);

const formatedBalance = computed(() => {
  if (!balance.value) return '';
  return formatAmount(formatUnits(balance.value, props.token.decimals), 2) + ' ' + props.token.symbol;
});

watch(balance, () => {
  if (balance.value) {
    emit('change', balance.value);
  }
}, { immediate: true });
</script>

<template>
  <div>
    <div
      v-if="!balance"
      class="min-w-[40px]"
    >
      <USkeleton class="w-full h-[14px]" />
    </div>
    <div v-else>
      {{ formatedBalance }}
    </div>
  </div>
</template>
