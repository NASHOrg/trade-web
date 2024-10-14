<script setup lang="ts">
import TeamChart from '~/blocks/dashboard/TeamChart.client.vue';
import CheckRulesModal from '~/blocks/dashboard/CheckRulesModal.vue';

const { t } = useI18n();
const { user } = useUserStore();

const userName = computed(() => shortAddress(user?.userAddress));
const btpAmount = computed(() => stakingAmount * 1.4);
const stakingAmount = 23900;
const badgeLevel = 6;

const myStakingAmount = 2390;
const teamStakingAmount = 350000;
const totalMinedAmount = 1905;

function checkRulesBtnOnTap() {
  useModal().open(CheckRulesModal);
}
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-full h-[590px] px-[25px] py-[20px]">
    <div
      class="gradient-card relative mt-[13px] mb-[32px] flex flex-col items-start ps-[30px] mx-[5px]"
    >
      <div class="mt-[20px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px]">
        {{ t('userNamesTeam', { userName }) }}
      </div>
      <h1 class="mt-[16px] text-[54px]">
        {{ btpAmount.toLocaleString() }} BTP
      </h1>
      <p class="mt-[8px] mb-[30px] text-[16px] text-[#666]">
        = {{ stakingAmount.toLocaleString() }} * 1.4 Staking BOOL
      </p>
      <div class="absolute right-[25px] bottom-0">
        <NuxtImg
          src="images/base_with_light.png"
          densities="1x 2x"
          height="133"
          width="145"
        />
        <NuxtImg
          class="absolute -top-[57px]"
          :src="`images/badge_rank_${badgeLevel}.png`"
          densities="1x 2x"
          height="148"
          width="196"
        />
        <UButton
          color="black"
          class="absolute bottom-[8px] right-[19px] px-[16px] py-[8px] text-[14px]"
          :ui="{ rounded: 'rounded-full' }"
          @click="checkRulesBtnOnTap"
        >
          {{ t('checkRules') }}
        </UButton>
      </div>
    </div>
    <div class="flex justify-between mx-[5px] text-[16px]">
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ myStakingAmount.toLocaleString() }}
        </p>
        <p>{{ t('myStaking') }}</p>
      </div>
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ teamStakingAmount.toLocaleString() }}
        </p>
        <p>{{ t('teamStaking') }}</p>
      </div>
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ totalMinedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
        </p>
        <p>{{ t('totalMined') }}</p>
      </div>
    </div>
    <TeamChart class="mt-[40px]" />
  </div>
</template>

<style scoped lang="postcss">
#number {
  font-size: 24px;
  color: #FF623F;
}

.gradient-card {
  border-radius: 28px;
  background: linear-gradient(80deg, #F6CEA6 0%, #FF623F 100%);
  box-shadow: 0 -3px 0 0 #FFC0B2;
  color: #333;
}
</style>
