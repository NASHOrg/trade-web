<script setup lang="ts">
const { t } = useI18n();

const { user } = useUserStore();

const userName = computed(() => shortAddress(user.value?.userAddress));

const airDropClaimedAmount = 756.88;
const badgeLevel = 4;

function claimBtnOnTap() {

}

function checkRulesBtnOnTap() {

}
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-full h-[590px] px-[30px] py-[40px]">
    <div
      class="relative mb-[40px] flex flex-col items-start gradient-card ps-[30px]"
    >
      <div
        class="mt-[20px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px]"
      >
        {{ userName ?? 'name' }}
      </div>
      <div class="mt-[20px] mb-[54px] flex items-center space-x-[16px]">
        <h1 class="text-[54px]">
          {{ Number(0).toLocaleString() }} BPP
        </h1>
        <UButton
          size="xs"
          color="black"
          @click="claimBtnOnTap"
        >
          {{ t('claim') }}
        </UButton>
      </div>
      <div class="absolute right-[25px] bottom-0">
        <NuxtImg
          src="images/base_with_light.png"
          densities="1x 2x"
          height="133"
          width="145"
        />
        <NuxtImg
          class="absolute -top-[57px] end-[20px]"
          :src="`images/medal_rank_${badgeLevel}.png`"
          densities="1x 2x"
          height="120"
          width="108"
        />
        <UButton
          color="black"
          class="absolute bottom-[8px] end-[19px] px-[16px] py-[8px] text-[14px]"
          :ui="{ rounded: 'rounded-full' }"
          @click="checkRulesBtnOnTap"
        >
          {{ t('checkRules') }}
        </UButton>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-[16px] text-[#999]">
        {{ t('airdropClaimed') }}
      </p>
      <p class="text-[24px]">
        + {{ airDropClaimedAmount.toLocaleString() }}
      </p>
    </div>
    <PersonalChart class="mt-[40px]" />
  </div>
</template>

<style scoped lang="postcss">
.gradient-card {
  border-radius: 28px;
  background: linear-gradient(80deg, #F6CEA6 0%, #FF623F 100%);
  box-shadow: 0 -3px 0 0 #FFC0B2;
  color: #333;
}
</style>
