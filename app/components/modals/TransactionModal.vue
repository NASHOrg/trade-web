<script lang="ts" setup>
defineProps<{
  status: 'approve' | 'send' | 'success';
  steps: string[];
  title?: string;
  token?: {
    icon?: string;
    contract?: string;
    symbol?: string;
  };
  transactionUrl?: string;
}>();

const emit = defineEmits(['close', 'approve']);

function onClose() {
  const modal = useModal();
  modal.close();
  emit('close', false);
}

const isApproving = ref(false);
function onApprove() {
  emit('approve');
}
</script>

<template>
  <UModal
    :ui="{ width: 'md:min-w-[600px] w-full' }"
    prevent-close
  >
    <div class="w-full relative flex flex-col items-center py-[48px] text-[#333]">
      <div
        class="absolute top-4 right-4 cursor-pointer"
        @click="onClose"
      >
        <IconClose />
      </div>
      <div class="text-[24px]">
        {{ title }}
      </div>
      <div
        v-if="status === 'approve'"
        class="flex flex-col items-center w-full"
      >
        <IconLoading class="mt-[60px] duration-800 animate-spin ease-in" />
        <span class="text-[18px] mt-[24px]">{{ $t('approveTip', { token: token?.symbol }) }}</span>
        <div class="w-[380px] mt-[60px] p-[16px] bg-[#ECEFF3] flex flex-col rounded-[8px] space-y-[18px]">
          <span class="break-all text-center">{{ token?.address }}</span>
          <ULink
            target="_blank"
            :to="transactionUrl"
            class="text-primary"
          >
            {{ $t('viewContract') }}
          </ULink>
        </div>
        <div class="grid grid-cols-2 gap-[20px] mt-[85px] w-full px-[66px]">
          <UButton
            block
            variant="outline"
            class="rounded-full"
            color="white"
            @click="onClose"
          >
            {{ $t('cancel') }}
          </UButton>
          <UButton
            block
            class="rounded-full"
            :loading="isApproving"
            @click="onApprove"
          >
            {{ $t('approve') }}
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>

<style scoped></style>
