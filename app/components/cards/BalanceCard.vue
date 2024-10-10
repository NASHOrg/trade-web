<script lang="ts" setup>
import { ethers } from 'ethers';
import { EvmApi } from '~/utils/api/evm';
import { SolanaApi } from '~/utils/api/solana';
import { TonApi } from '~/utils/api/ton';
import { isSolana } from '~/utils/solana-wallets';
import { isTon } from '~/utils/ton-wallets';

const props = defineProps<{
  chainId: number;
  address: string;
  value?: string;
  token?: {
    contract?: string;
    decimals: string;
    symbol: string;
  };
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'update:value', value: string): void;
}>();

const userStore = useUserStore();

const { data, status } = useAsyncData(
  `balance-${props.chainId}-${props.token?.contract ?? props.address}`,
  async () => {
    if (isSolana(props.chainId)) {
      const solanaApi = new SolanaApi(
        userStore.currentNetwork.network === 'alpha_mainnet'
          ? 'mainnet'
          : 'devnet',
      );
      return await solanaApi.getBalance({
        contract: props.token?.contract,
        address: props.address,
      });
    }
    else if (isTon(props.chainId)) {
      const tonApi = new TonApi(
        userStore.currentNetwork.network === 'alpha_mainnet'
          ? 'mainnet'
          : 'testnet',
      );
      return await tonApi.getBalance({
        contract: props.token?.contract,
        address: props.address,
      });
    }

    const chain = EvmApi.getChain(props.chainId);
    if (!chain) {
      return '0';
    }
    const evmApi = new EvmApi(chain.rpcUrl);
    const balance = await evmApi.getBalance({
      address: props.address,
      contractAddress: props.token?.contract,
    });
    return balance.toString();
  },
  {
    watch: [() => props.chainId, () => props.address],
    server: false,
  },
);

const formatBalance = computed(() => {
  const _amount = ethers
    .formatUnits(data.value ?? '0', Number(props.token?.decimals ?? 18))
    .toString();

  return formaCurrency(shortFloatNum(_amount, 6));
});

watch(
  () => data.value,
  () => {
    emit('change', data.value ?? '0');
    emit('update:value', data.value ?? '0');
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="inline-block">
    <USkeleton
      v-if="status === 'pending'"
      class="h-2 w-[100px]"
    />
    <span v-else>{{ formatBalance }} {{ token?.symbol }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
