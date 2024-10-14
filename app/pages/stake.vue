<script setup lang="ts">
import StakeStatWindow from '~/blocks/stake/StakeStatWindow.vue';

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] max-w-[600px]">
    <div class="window w-[600px]">
      <StakeStatWindow />
    </div>
    <div class="mt-[28px] window w-[600px] h-[574px] flex flex-col p-[30px]">
      <h2 class="text-[24px]">
        {{ t('dhcList') }}
      </h2>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.window {
  border-radius: 12px;
  border: 1px solid white;
  background-color: black;
  box-shadow: 4px 4px 0 0 white;
  overflow: hidden;
}
</style>
