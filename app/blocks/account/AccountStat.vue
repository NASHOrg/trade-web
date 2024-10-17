<script setup lang="ts">
const props = defineProps<{
  mode: 'team' | 'personal';
}>();

const emit = defineEmits(['switch']);

const { t } = useI18n();
const { $api } = useNuxtApp();
const { user, token } = useUserStore();

const rank = computed(() => {
  switch (data.value?.level) {
    case 2:
      return 'bronze';
    case 3:
      return 'silver';
    case 4:
      return 'gold';
    case 5:
      return 'platinum';
    case 6:
      return 'diamond';
    case 7:
      return 'master';
    case 1:
    default:
      return 'iron';
  }
});

const powerMultiplier = computed(() => {
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

const stakeAmount = computed(() =>
  props.mode === 'team'
    ? Number(data.value?.teamStake ?? 0)
    : Number(data.value?.pesonalStake ?? 0));

const nextRankMinimumStakeRequireAmount = computed(() => {
  switch (data.value?.level) {
    case 2:
      return 20000;
    case 3:
      return 150000;
    case 4:
      return 200000;
    case 5:
      return 300000;
    case 6:
      return 500000;
    case 7:
      return 0;
    case 1:
    default:
      return 10000;
  }
});

const { data } = useAsyncData(
  'power-single-self',
  () => $api.powerSingle(
    { address: user!.userAddress, type: props.mode === 'team' ? '0' : '1' },
    token,
  ),
  { immediate: true },
);
</script>

<template>
  <div class="card py-[40px] px-[30px] flex flex-col">
    <div class="flex justify-between">
      <div class="flex flex-col">
        <div class="flex space-x-[16px]">
          <p class="text-[18px]">
            {{ t(mode === 'team' ? 'teamAccount' : 'personalAccount') }}
          </p>
          <button @click="emit('switch')">
            <NuxtImg
              src="images/icon_switch_rounded_white.png"
              densities="1x 2x"
              height="18"
              width="18"
            />
          </button>
        </div>
        <h1 class="mt-[30px] text-[40px] text-primary-500">
          {{ mode === 'team' ? `${t(rank)} ${t('troops')}` : `${t(rank)} ${t('miner')}` }}
        </h1>
      </div>
      <div
        v-if="mode === 'team'"
        class="flex flex-col items-center space-y-[6px]"
      >
        <NuxtImg
          :src="`images/${mode === 'team' ? 'badge' : 'medal'}_rank_${data?.level ?? 1}.png`"
          densities="1x 2x"
          height="120"
          :width="mode === 'team' ? 168 : 108"
        />
        <p
          v-if="data?.level !== 7"
          class="text-[14px]"
        >
          {{ nextRankMinimumStakeRequireAmount - stakeAmount }} BOOL
        </p>
        <UProgress
          v-if="data?.level !== 7"
          :value="stakeAmount"
          :max="nextRankMinimumStakeRequireAmount"
          size="xs"
          class="w-[100px]"
        />
        <div class="flex space-x-[6px] text-[#999] text-[14px]">
          <span>To upgrade</span>
          <!--          <NuxtImg -->
          <!--            src="images/icon_info_circle_grey.png" -->
          <!--            densities="1x 2x" -->
          <!--            height="14" -->
          <!--            width="14" -->
          <!--          /> -->
        </div>
      </div>
    </div>
    <div class="mt-[17px] mb-[12px] border-t border-[#2E2E2E]" />
    <template v-if="mode === 'team'">
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('staking') }}:
        </p>
        <p>{{ `${Number(data?.teamStake ?? 0).toLocaleString()} BOOL` }}</p>
      </div>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('level') }}:
        </p>
        <p>{{ `${t('level')} ${Number(data?.level ?? 1).toLocaleString()}` }}</p>
      </div>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('validity') }}:
        </p>
        <p>{{ t('dailyRefreshing') }}</p>
      </div>
      <div
        v-if="powerMultiplier > 0"
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('bonus') }}:
        </p>
        <p>{{ `x ${powerMultiplier}` }}</p>
      </div>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('rewards') }}:
        </p>
        <p>{{ `${Number(data?.reward ?? 0).toLocaleString()} BOOL` }}</p>
      </div>
    </template>
    <template v-else>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('staking') }}:
        </p>
        <p>{{ `${Number(data?.pesonalStake ?? 0).toLocaleString()} BOOL` }}</p>
      </div>
      <!--      <div -->
      <!--        class="flex justify-between py-[8px] text-[18px]" -->
      <!--      > -->
      <!--        <p class="text-white/80"> -->
      <!--          {{ t('level') }}: -->
      <!--        </p> -->
      <!--        <p>{{ `${t('level')} ${Number(data?.level ?? 1).toLocaleString()}` }}</p> -->
      <!--      </div> -->
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('validity') }}:
        </p>
        <p>{{ t('permanent') }}</p>
      </div>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('rebate') }}:
        </p>
        <p>{{ '10% (T1) + 5% (T2)' }}</p>
      </div>
      <div
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t('rewards') }}:
        </p>
        <p>{{ `${Number(data?.reward ?? 0).toLocaleString()} BOOL` }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
