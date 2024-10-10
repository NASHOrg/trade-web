<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { ConnectedWallet } from '~/types/common';

const props = defineProps<{
  wallet: ConnectedWallet<any>;
  active?: boolean;
  connect?: (wallet: ConnectedWallet<any>) => Promise<void> | void;
  disconnect?: (wallet: ConnectedWallet<any>) => Promise<void> | void;
}>();
const walletAddress = computed(() => {
  return props.wallet.accounts?.[0]?.address;
});

const loading = ref(false);
const connect = async () => {
  loading.value = true;
  await props.connect?.(props.wallet);
  loading.value = false;
};

const disconnect = async () => {
  loading.value = true;
  await props.disconnect?.(props.wallet);
  loading.value = false;
};

const onCopy = async () => {
  try {
    await copyText(walletAddress.value ?? '');
  }
  catch (err) {
    if (err instanceof Error) {
      toast.error('Copy error');
    }
  }
};
</script>

<template>
  <div
    class="w-full h-[46px] flex items-center border border-1 border-bool-300 px-2 cursor-pointer rounded-lg relative select-none"
    @click="connect"
  >
    <div
      class="w-2 h-2 rounded-full mr-1"
      :class="{ 'bg-green-600': active, 'bg-gray-400': !active }"
    />

    <UAvatar
      :src="wallet.icon"
      :alt="wallet.label"
      size="xs"
      :ui="{ rounded: 'rounded-md' }"
    />
    <div
      class="grow flex flex-col justify-center text-base leading-5 font-medium pl-3"
    >
      <span>{{ wallet.label }}</span>
      <div
        v-if="walletAddress"
        class="w-full text-xs font-normal flex"
      >
        <div>{{ shortAddress(walletAddress) }}</div>
        <div
          class="ml-1"
          @click="onCopy"
        >
          <UIcon
            name="mdi:content-copy"
            :size="12"
          />
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="flex items-center justify-center"
    >
      <UIcon
        class="w-6 h-6"
        name="svg-spinners:90-ring-with-bg"
      />
    </div>
    <div
      v-if="!loading && walletAddress"
      class="flex items-center justify-center"
      @click.stop="disconnect"
    >
      <UIcon
        class="w-5 h-5"
        name="i-mdi-logout"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
