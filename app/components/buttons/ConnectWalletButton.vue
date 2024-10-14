<script setup lang="ts">
defineProps<{ showAddress?: boolean }>();

const evmWallet = useWallet();
</script>

<template>
  <UButton
    size="sm"
    @click="evmWallet.modal.open({ view: evmWallet.isConnected.value ? 'Account': 'Connect' })"
  >
    <div class="flex items-center">
      <UAvatar
        v-if="evmWallet.address.value"
        size="xs"
        class="w-5 h-5 mr-1"
        :src="evmWallet.walletInfo.value?.icon"
      />
      <div
        class="mr-1"
        :class="{ 'md:block hidden': !showAddress }"
      >
        {{
          evmWallet.address.value
            ? shortAddress(evmWallet.address.value ?? "")
            : "Connect Wallet"
        }}
      </div>
      <IconWallet
        v-if="!evmWallet.address.value"
        class="w-5 h-5"
      />
    </div>
  </UButton>
</template>

<style lang="scss" scoped></style>
