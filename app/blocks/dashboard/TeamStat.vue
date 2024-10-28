<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { CheckRulesModal } from '#components';

const { $api } = useNuxtApp();
const { t } = useI18n();
const { token, user } = storeToRefs(useUserStore());

const userName = computed(() => shortAddress(user.value?.userAddress));
const powerMultiplier = computed<number>(() => {
  switch (data.value?.level) {
    case 2:
      return 1;
    case 3:
      return 1.1;
    case 4:
      return 1.2;
    case 5:
      return 1.3;
    case 6:
      return 1.4;
    case 7:
      return 1.5;
    case 1:
    default:
      return 0;
  }
});

const modal = useModal();

function onCheckRules() {
  modal.open(CheckRulesModal);
}

const { data } = useAsyncData(
  `power-single-team`,
  () => {
    if (!token.value || !user.value) return Promise.resolve(undefined);
    return $api.powerSingle({ address: user.value!.userAddress, type: '0' }, token.value);
  },
  { watch: [token, user] },
);
</script>

<template>
  <div class="flex flex-col mt-[28px] card w-full px-[25px] py-[20px]">
    <div
      class="gradient-card relative mt-[13px] mb-[32px] flex flex-col items-start ps-[30px] mx-[5px]"
    >
      <USkeleton
        v-if="!userName"
        :ui="{ background: 'dark:bg-[#FFD9C5]' }"
        class="mt-[20px] rounded-[55px] h-[26px] w-[150px]"
      />
      <div
        v-else
        class="mt-[20px] bg-[#FFD9C5] rounded-[55px] px-[16px] py-[4px]"
      >
        {{ t('userNamesTeam', { userName }) }}
      </div>
      <h1 class="mt-[16px] text-[54px]">
        {{ (BigNumber(data?.power ?? 0).dp(6, 1).toNumber() * powerMultiplier).toLocaleString() }} BTP
      </h1>
      <p
        v-if="powerMultiplier !== 0"
        class="mt-[8px] mb-[30px] text-[16px] text-[#666]"
      >
        = {{ Number(data?.power ?? 0).toLocaleString() }} * {{ powerMultiplier }} Staking BOOL
      </p>
      <div
        v-else
        class="mb-[54px]"
      />
      <div class="absolute right-[25px] bottom-0">
        <NuxtPicture
          src="images/base_with_light.png"
          densities="1x 2x"
          height="133"
          width="145"
        />
        <NuxtPicture
          class="absolute -top-[57px]"
          :src="`images/badge_rank_${data?.level ?? 1}.png`"
          densities="1x 2x"
          height="148"
          width="196"
        />
        <UButton
          color="black"
          class="absolute bottom-[8px] right-[19px] px-[16px] py-[8px] text-[14px]"
          :ui="{ rounded: 'rounded-full' }"
          @click="onCheckRules"
        >
          {{ t('checkRules') }}
        </UButton>
      </div>
    </div>
    <div class="flex justify-between mx-[5px] text-[16px]">
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ Number(data?.pesonalStake ?? 0).toLocaleString() }}
        </p>
        <p>{{ t('myStaking') }}</p>
      </div>
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ Number(data?.teamStake ?? 0).toLocaleString() }}
        </p>
        <p>{{ t('teamStaking') }}</p>
      </div>
      <div class="flex flex-col text-center space-y-[16px]">
        <p id="number">
          {{ Number(data?.reward ?? 0).toLocaleString() }}
        </p>
        <p>{{ t('totalMined') }}</p>
      </div>
    </div>
    <TeamChart />
  </div>
</template>

<style scoped>
#number {
  font-size: 24px;
  color: #FF623F;
}
</style>
