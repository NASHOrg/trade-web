<script setup lang="ts">
const { t } = useI18n();
const tabs = [
  {
    id: 'team',
    name: t('teamPower'),
  },
  {
    id: 'self',
    name: t('personalPower'),
  },
];
const selectedTab = ref('team');
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] w-full">
    <div class="card flex justify-between p-[4px] space-x-[4px] h-[52px]">
      <button
        v-for="item in tabs"
        :key="item.id"
        class="px-[12px]"
        :class="{ 'text-black bg-white rounded-[6px]': selectedTab === item.id }"
        @click="selectedTab = item.id"
      >
        {{ item.name }}
      </button>
    </div>
    <TeamStat v-if="selectedTab === 'team'" />
    <PersonalStat v-else />
    <RewardHistory />
  </div>
</template>
