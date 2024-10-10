<script lang="ts" setup>
import type { WalletName } from '~/types/common';

const props = defineProps<{
  type: WalletName;
}>();

const emit = defineEmits<{
  (e: 'finish', value?: string): void;
}>();

const modalRef = ref();
const isOpen = ref(false);

const solanaWallet = useWalletGroup('solana');
const tonWallet = useWalletGroup('ton');
const bitcoinWallet = useWalletGroup('bitcoin');

const close = () => {
  modalRef.value?.close?.();
  isOpen.value = false;
};

const open = () => {
  isOpen.value = true;
};

const onClose = () => {
  if (props.type === 'solana') {
    emit('finish', solanaWallet.address.value);
  }
  else if (props.type === 'ton') {
    emit('finish', tonWallet.address.value);
  }
  else if (props.type === 'bitcoin') {
    emit('finish', bitcoinWallet.address.value);
  }
};

const onFinish = (val: 'connect' | 'disconnect') => {
  if (val === 'connect') {
    close();
  }
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <UModal
    ref="modalRef"
    v-model:model-value="isOpen"
    :ui="{ width: 'md:w-[360px] sm:w-full' }"
    @close="onClose"
  >
    <div class="w-full relative">
      <div
        class="absolute top-2 right-2 cursor-pointer"
        @click="close"
      >
        <IconClose />
      </div>

      <BitcoinWalletMenu
        v-if="type === 'bitcoin'"
        @finish="onFinish"
      />
      <TonWalletMenu
        v-else-if="type === 'ton'"
        @finish="onFinish"
      />
      <SolanaWalletMenu
        v-else-if="type === 'solana'"
        @finish="onFinish"
      />
    </div>
  </UModal>
</template>

<style scoped lang="scss"></style>
