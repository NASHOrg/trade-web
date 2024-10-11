<script setup lang="ts">
const { t } = useI18n();

const userName = '0x87aa...efbee3';
const btpAmount = computed(() => stakingAmount * 1.4);
const stakingAmount = 23900;

const myStakingAmount = 2390;
const teamStakingAmount = 350000;
const totalMinedAmount = 1905;
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-full h-[590px] px-[30px] py-[40px]">
    <div
      class="mb-[32px] flex flex-col items-start bg-gradient-to-r text-[#333] from-[#F6CEA6] to-[#FF623F] rounded-[28px] ps-[30px]"
    >
      <div class="mt-[40px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px]">
        {{ t('userNamesTeam', { userName }) }}
      </div>
      <h1 class="mt-[20px] text-[54px]">
        {{ btpAmount.toLocaleString() }} BTP
      </h1>
      <p class="mt-[8px] mb-[30px] text-[16px] text-[#666]">
        = {{ stakingAmount.toLocaleString() }} * 1.4 Staking BOOL
      </p>
    </div>
    <div class="flex justify-between">
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
    <div class="mt-[40px] flex-grow flex flex-col bg-[#666] text-center justify-center">
      CHART AREA
    </div>
  </div>
</template>

<style scoped lang="postcss">
#number {
  font-size: 24px;
  line-height: 40px;
  color: #FF623F;
}
</style>
