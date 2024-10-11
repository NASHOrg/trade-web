<script setup lang="ts">
const { t } = useI18n();

const userName = '0x87aa...efbee3';

const airDropClaimedAmount = 756.88;

function claimBtnOnTap() {

}
</script>

<template>
  <div class="flex flex-col mt-[28px] window w-full h-[590px] px-[30px] py-[40px]">
    <div
      class="mb-[40px] flex flex-col items-start gradient-card ps-[30px]"
    >
      <div class="mt-[20px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px]">
        {{ userName }}
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
