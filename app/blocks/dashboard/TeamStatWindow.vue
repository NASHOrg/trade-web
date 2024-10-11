<script setup lang="ts">
import TeamChart from '~/blocks/dashboard/TeamChart.client.vue';

const { t } = useI18n();

const userName = '0x87aa...efbee3';
const btpAmount = computed(() => stakingAmount * 1.4);
const stakingAmount = 23900;

const myStakingAmount = 2390;
const teamStakingAmount = 350000;
const totalMinedAmount = 1905;
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-full h-[590px] px-[25px] py-[20px]">
    <div
      class="gradient-card mt-[13px] mb-[32px] flex flex-col items-start ps-[30px] mx-[5px]"
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
    </div>
    <div class="flex justify-between mx-[5px] text-[16px]">
      <p class="text-center">
        <span id="number">{{ myStakingAmount.toLocaleString() }}</span> <br>
        {{ t('myStaking') }}
      </p>
      <p class="text-center">
        <span id="number">{{ teamStakingAmount.toLocaleString() }}</span> <br>
        {{ t('teamStaking') }}
      </p>
      <p class="text-center">
        <span id="number">{{ totalMinedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span> <br>
        {{ t('totalMined') }}
      </p>
    </div>
    <TeamChart class="mt-[40px]" />
  </div>
</template>

<style scoped lang="postcss">
#number {
  font-size: 24px;
  line-height: 40px;
  color: #FF623F;
}

.gradient-card {
  border-radius: 28px;
  background: linear-gradient(80deg, #F6CEA6 0%, #FF623F 100%);
  box-shadow: 0 -3px 0 0 #FFC0B2;
  color: #333;
}
</style>
