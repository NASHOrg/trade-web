<script setup lang="ts">
const { t } = useI18n();

const selectedTab = ref<'team' | 'self'>('team');
</script>

<template>
  <div class="flex flex-col items-center pt-[40px] max-w-[600px]">
    <div class="window flex justify-between p-[4px] space-x-[4px]">
      <button
        class="tab"
        :class="selectedTab === 'team' ? 'tab-selected' : ''"
        @click="selectedTab = 'team'"
      >
        {{ t('teamPower') }}
      </button>
      <button
        class="tab"
        :class="selectedTab === 'self' ? 'tab-selected' : ''"
        @click="selectedTab = 'self'"
      >
        {{ t('personalPower') }}
      </button>
    </div>
    <div class="mt-[28px] window w-[600px] h-[590px]" />
    <div class="mt-[28px] window w-[600px] h-[574px]" />
  </div>
</template>

<style scoped lang="postcss">
.window {
  border-radius: 6px;
  border: 1px solid white;
  background-color: black;
  box-shadow: 4px 4px 0 0 white;

  .tab {
    padding: 12px 35px;
  }

  .tab-selected {
    color: black;
    background-color: white;
    border-radius: 6px;
  }
}
</style>
