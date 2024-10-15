<script lang="ts" setup>
import EligibilityCheckModal from '~/components/modals/EligibilityCheckModal.vue';

function checkBtnOnTap() {
  useModal().open(EligibilityCheckModal);
}
</script>

<template>
  <div class="my-[30px] flex flex-col items-center justify-center">
    <p
      class="mt-[100px] text-4xl"
    >
      Connect your wallet to get started.
    </p>
    <ConnectWalletButton class="mt-8" />
    <UButton
      class="mt-8"
      @click="checkBtnOnTap"
    >
      Trigger Eligibility Check
    </UButton>
  </div>
</template>
