<script setup lang="ts">
import { formatAmount } from '../../utils/helpers';
import EligibilityCheckModal from '~/components/modals/EligibilityCheckModal.vue';

const { $api } = useNuxtApp();
const { t } = useI18n();
const { user, token } = useUserStore();

const userStore = useUserStore();

const userName = computed(() => shortAddress(userStore.user?.userAddress));

// const badgeLevel = 4;
const modal = useModal();

function onClaim() {
  modal.open(EligibilityCheckModal);
}

// function onCheckRules() {
//   modal.open(CheckRulesModal);
// }

const { data } = useAsyncData(
  'power-single-self',
  () => {
    if (!token) return Promise.resolve(undefined);
    return $api.powerSingle({ address: user!.userAddress, type: '1' }, token);
  },
);
</script>

<template>
  <div class="card flex flex-col mt-[28px] w-full px-[30px] py-[40px]">
    <div
      class="relative mb-[40px] flex flex-col items-start gradient-card ps-[30px]"
    >
      <USkeleton
        v-if="!userName"
        class="mt-[20px] rounded-[55px] h-[26px] w-[150px]"
      />
      <div
        v-else
        class="mt-[20px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px] text-[18px]"
      >
        {{ userName }}
      </div>
      <div class="mt-[20px] mb-[54px] flex items-center space-x-[16px]">
        <h1 class="text-[54px]">
          {{ formatAmount(data?.power ?? '0', 2) }} BPP
        </h1>
        <UButton
          size="xs"
          color="black"
          class="rounded-[4px]"
          @click="onClaim"
        >
          {{ t('claim') }}
        </UButton>
      </div>
      <!--      <div class="absolute right-[25px] bottom-0"> -->
      <!--        <NuxtImg -->
      <!--          src="images/base_with_light.png" -->
      <!--          densities="1x 2x" -->
      <!--          height="133" -->
      <!--          width="145" -->
      <!--        /> -->
      <!--        <NuxtImg -->
      <!--          class="absolute -top-[57px] end-[20px]" -->
      <!--          :src="`images/medal_rank_${badgeLevel}.png`" -->
      <!--          densities="1x 2x" -->
      <!--          height="120" -->
      <!--          width="108" -->
      <!--        /> -->
      <!--        <UButton -->
      <!--          color="black" -->
      <!--          class="absolute bottom-[8px] end-[19px] px-[16px] py-[8px] text-[14px]" -->
      <!--          @click="onCheckRules" -->
      <!--        > -->
      <!--          {{ t('checkRules') }} -->
      <!--        </UButton> -->
      <!--      </div> -->
    </div>
    <div class="flex justify-between items-center">
      <p class="text-[16px] text-[#999]">
        {{ t('airdropClaimed') }}
      </p>
      <p class="text-[24px]">
        + {{ Number(data?.reward ?? 0).toLocaleString() }}
      </p>
    </div>
    <PersonalChart />
  </div>
</template>
