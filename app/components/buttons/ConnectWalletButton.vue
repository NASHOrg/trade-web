<script setup lang="ts">
import { ConnectWalletModal } from '#components';

defineProps<{
  showAddress?: boolean;
}>();

const evmWallet = useWallet();
const solanaWallet = useWalletGroup('solana');
const tonWallet = useWalletGroup('ton');
const bitcoinWallet = useWalletGroup('bitcoin');
const modal = useModal();

const opened = ref(false);
const wallets = computed(() => {
  return [
    {
      label: 'EVM Wallet',
      address: evmWallet.address.value,
      wallet: evmWallet.walletInfo.value,
      click: () => {
        evmWallet.modal.open();
        opened.value = false;
      },
      disconnect: () => {
        evmWallet.modal.open();
        opened.value = false;
      },
    },
    {
      label: 'Solana Wallet',
      address: solanaWallet.address.value,
      wallet: solanaWallet.activeWallet.value!,
      click: () => {
        modal.open(ConnectWalletModal, { type: 'solana' });
        opened.value = false;
      },
      disconnect: () => {
        if (solanaWallet.activeWallet.value) {
          solanaWallet.disconnectWallet(solanaWallet.activeWallet.value!);
          opened.value = false;
        }
      },
    },
    {
      label: 'TON Wallet',
      address: tonWallet.address.value,
      wallet: tonWallet.activeWallet.value!,
      click: () => {
        modal.open(ConnectWalletModal, { type: 'ton' });
        opened.value = false;
      },
      disconnect: async () => {
        try {
          if (tonWallet.activeWallet.value) {
            await tonWallet.disconnectWallet(tonWallet.activeWallet.value!);
            opened.value = false;
          }
        }
        catch (err) {
          console.log(err);
        }
      },
    },
    {
      label: 'Bitcoin Wallet',
      address: bitcoinWallet.address.value,
      wallet: bitcoinWallet.activeWallet.value!,
      click: () => {
        modal.open(ConnectWalletModal, { type: 'bitcoin' });
        opened.value = false;
      },
      disconnect: async () => {
        try {
          if (bitcoinWallet.activeWallet.value) {
            await bitcoinWallet.disconnectWallet(
              bitcoinWallet.activeWallet.value!,
            );
            opened.value = false;
          }
        }
        catch (err) {
          console.log(err);
        }
      },
    },
  ];
});

const walletInfo = computed(() => {
  if (evmWallet.address.value) {
    return {
      icon: evmWallet.walletInfo.value?.icon,
      address: evmWallet.address.value,
    };
  }
  else if (tonWallet.address.value) {
    return {
      icon: tonWallet.activeWallet.value?.icon ?? '',
      address: tonWallet.address.value,
    };
  }
  else if (solanaWallet.address.value) {
    return {
      icon: solanaWallet.activeWallet.value?.icon ?? '',
      address: solanaWallet.address.value ?? '',
    };
  }

  return { icon: '', address: '' };
});
</script>

<template>
  <UPopover v-model:open="opened">
    <UButton size="sm">
      <div class="flex items-center">
        <UAvatar
          v-if="walletInfo.address"
          size="xs"
          class="w-5 h-5 mr-1"
          :src="walletInfo.icon"
        />
        <div
          class="mr-1"
          :class="{ 'md:block hidden': !showAddress }"
        >
          {{
            walletInfo?.address
              ? shortAddress(walletInfo.address ?? "")
              : "Connect Wallet"
          }}
        </div>
        <IconWallet
          v-if="!walletInfo"
          class="w-5 h-5"
        />
      </div>
    </UButton>

    <template #panel>
      <div class="w-auto px-4 py-2">
        <div
          v-for="wallet in wallets"
          :key="wallet.label"
          class="w-full pb-3"
        >
          <div class="min-w-[280px] flex justify-between items-center pb-2">
            <div
              class="text-lg font-bold text-neutral-700 dark:text-neutral-400"
            >
              {{ wallet.label }}
            </div>
            <!-- <a class="text-xs font-normal cursor-pointer">Disconnect</a> -->
          </div>

          <div
            v-if="wallet.address"
            class="w-full"
          >
            <WalletCard
              :wallet="wallet.wallet"
              :active="true"
              :disconnect="wallet.disconnect"
            />
          </div>
          <UButton
            v-else
            color="white"
            :block="true"
            @click="wallet.click"
          >
            <div class="w-full flex items-center justify-center">
              Connect
            </div>
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<style lang="scss" scoped></style>
