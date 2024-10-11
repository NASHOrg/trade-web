<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-[600px] h-[574px] p-[30px]">
    <div class="flex justify-between">
      <h3 class="text-white text-[24px]">
        {{ t('rewardsHistory') }}
      </h3>
      <div class="flex items-center space-x-[8px]">
        <NuxtImg
          src="images/icon_questionmmark_circle_grey.png"
          densities="1x 2x"
          height="14"
          width="14"
        />
        <p class="text-[#999] text-[14px]">
          {{ t('howToUnlockTheRewards') }}
        </p>
      </div>
    </div>
    <div class="mt-[28px] flex-grow flex flex-col bg-[#666] text-center justify-center">
      TABLE AREA
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
