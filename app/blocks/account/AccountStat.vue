<script setup lang="ts">
defineProps<{
  mode: 'team' | 'personal';
}>();

const emit = defineEmits(['switch']);

const { t } = useI18n();

const teamStats = {
  staking: '350,000.00 BOOL',
  level: 'Level 2',
  validity: t('dailyRefreshing'),
  bonus: 'x 1.5',
  rewards: '1905.00 BOOL',
};

const personalStats = {
  staking: '2390.00 BOOL',
  level: 'Level 3',
  validity: t('permanent'),
  rebate: '10% (T1) + 5% (T2)',
  rewards: '1998.95 BOOL',
};
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
          {{ mode === 'team' ? 'Master Troops' : 'Gold Miner' }}
        </h1>
      </div>
      <div class="flex flex-col items-center space-y-[6px]">
        <NuxtImg
          :src="mode === 'team' ?'images/badge_rank_6.png' : 'images/medal_rank_4.png'"
          densities="1x 2x"
          height="120"
          :width="mode === 'team' ? 168 : 108"
        />
        <p class="text-[14px]">
          {{ mode === 'team' ? '20,000' : '610' }} BOOL
        </p>
        <UProgress
          :value="80"
          size="xs"
          class="w-[100px]"
        />
        <div class="flex space-x-[6px] text-[#999] text-[14px]">
          <span>To upgrade</span>
          <NuxtImg
            src="images/icon_info_circle_grey.png"
            densities="1x 2x"
            height="14"
            width="14"
          />
        </div>
      </div>
    </div>
    <div class="mt-[17px] mb-[12px] border-t border-[#2E2E2E]" />
    <template v-if="mode === 'team'">
      <div
        v-for="(value, key) in teamStats"
        :key="'team'+ key"
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t(key) }}:
        </p>
        <p>{{ value }}</p>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(value, key) in personalStats"
        :key="'personal' + key"
        class="flex justify-between py-[8px] text-[18px]"
      >
        <p class="text-white/80">
          {{ t(key) }}:
        </p>
        <p>{{ value }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
