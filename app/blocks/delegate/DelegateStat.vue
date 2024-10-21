<script setup lang="ts">
const { t } = useI18n();

const { user } = useUserStore();
</script>

<template>
  <div class="w-full card flex flex-col py-[40px] px-[30px]">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h2>{{ t('delegateYourBPPToFarmMoreBOOL') }}</h2>
        <ul class="mt-[16px] ms-[30px] list-disc space-y-[10px] text-white/80 text-[16px]">
          <li>{{ t('publicPool') }}</li>
          <li>{{ t('superPool') }}</li>
          <li>{{ t('vipPool') }}</li>
        </ul>
      </div>
      <NuxtImg
        src="images/dirt_with_plant_white.png"
        densities="1x 2x"
        height="80"
        width="80"
      />
    </div>
    <div class="mt-[40px] mx-[10px] inner-glowing-box flex justify-between">
      <div class="flex flex-col items-center space-y-[16px]">
        <p>{{ t('availablePower') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <p
          v-else
          class="data-text"
        >
          {{ 0.88 }} BPP
        </p>
      </div>
      <div class="flex flex-col items-center space-y-[16px]">
        <p>{{ t('delegatedPower') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <p
          v-else
          class="data-text"
        >
          {{ 1756 }} BPP
        </p>
      </div>
      <div class="flex flex-col items-center space-y-[16px]">
        <p>{{ t('totalRewards') }}</p>
        <USkeleton
          v-if="!user"
          class="h-[24px] w-[48px]"
        />
        <p
          v-else
          class="data-text"
        >
          {{ 190.56 }} BOOL
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">

</style>
