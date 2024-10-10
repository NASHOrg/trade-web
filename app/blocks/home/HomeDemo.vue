<script setup lang="ts">
import { toast } from 'vue-sonner';
import { ConfirmModal, ConnectWalletModal, UButton } from '#components';
import type { WalletName } from '~/types/common';

const { $gsap } = useNuxtApp();
onMounted(() => {
  $gsap.from('#confirm-modal-button', {
    opacity: 0,
    y: 80,
    duration: 1,
    ease: 'rough',
  });
});
const modal = useModal();
function openModal() {
  console.log('openModal');
  modal.open(ConfirmModal, {
    title: 'Confirm to proceed',
    onConfirm: () => {
      toast.success('Success');
    },
  });
}
const { activeWallet: bitcoinActiveWallet } = useWalletGroup('bitcoin');
const { activeWallet: solanaActiveWallet } = useWalletGroup('solana');
const { activeWallet: tonActiveWallet } = useWalletGroup('ton');

const connectWallet = (label: WalletName) => {
  console.log(label);
  modal.open(ConnectWalletModal, { type: label });
};
</script>

<template>
  <div class="z-10 mt-6 flex flex-col items-center space-y-6">
    <div
      id="confirm-modal-button"
      class="flex flex-row space-x-4"
    >
      <UButton @click="connectWallet('bitcoin')">
        Connect BTC Wallet
      </UButton>
      <UButton @click="connectWallet('ton')">
        Connect Ton Wallet
      </UButton>
      <UButton @click="connectWallet('solana')">
        Connect Solana Wallet
      </UButton>
      <UButton @click="openModal()">
        Show confirm modal
      </UButton>
    </div>
    <div class="w-full">
      <div>
        <span>TON-</span><span>{{ tonActiveWallet?.accounts?.[0]?.address ?? "-" }}</span>
      </div>
      <div>
        <span>Solana-</span><span>{{ solanaActiveWallet?.accounts?.[0]?.address ?? "-" }}</span>
      </div>
      <div>
        <span>Bitcoin-</span><span>{{ bitcoinActiveWallet?.accounts?.[0]?.address ?? "-" }}</span>
      </div>
    </div>
    <div class="flex flex-row space-x-2">
      <UIcon name="i-lucide-app-window-mac" />
      <UIcon name="i-heroicons-light-bulb" />
      <UIcon name="i-heroicons-moon" />
    </div>
  </div>
</template>
