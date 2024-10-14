<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] max-w-[600px]">
    <div class="card w-[600px]">
      <StakeStat />
    </div>
    <div class="mt-[28px] window w-[600px] h-[574px] flex flex-col p-[30px]">
      <h2 class="text-[24px]">
        {{ t('dhcList') }}
      </h2>
    </div>
  </div>
</template>
