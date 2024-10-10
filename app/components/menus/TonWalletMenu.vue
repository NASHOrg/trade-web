<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { ConnectedWallet } from '~/types/common';

const emits = defineEmits<{
  (e: 'finish', val: 'connect' | 'disconnect'): void;
}>();

const { connectWallet, wallets, disconnectWallet, activeWallet }
  = useWalletGroup('ton');
const onConnect = async (wallet: ConnectedWallet<'ton'>) => {
  try {
    await connectWallet(wallet);
    emits('finish', 'connect');
  }
  catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};

const onDisconnect = async (wallet: ConnectedWallet<'ton'>) => {
  try {
    await disconnectWallet(wallet);
    emits('finish', 'disconnect');
  }
  catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};
</script>

<template>
  <UCard :ui="{ header: { padding: 'sm:px-4 p-2 pt-4' } }">
    <template #header>
      <div class="font-bold text-xl">
        TON Wallets
      </div>
    </template>

    <div class="w-full flex flex-col space-y-2">
      <WalletCard
        v-for="wallet in wallets"
        :key="wallet.label"
        :wallet="wallet"
        :active="activeWallet?.label === wallet.label"
        :connect="onConnect"
        :disconnect="onDisconnect"
      />
    </div>
  </UCard>
</template>

<style scoped lang="scss"></style>
