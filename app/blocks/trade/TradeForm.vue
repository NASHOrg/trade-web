<script lang="ts" setup>
const { t } = useI18n();
const activeTab = ref<'limit' | 'market'>('limit');

const tabs = computed<{ value: 'limit' | 'market'; label: string }[]>(() => {
  return [
    {
      value: 'limit',
      label: t('Limit'),
    },
    {
      value: 'market',
      label: t('market'),
    },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col px-4 ">
    <div
      class="flex justify-start space-x-[30px] border-b-[1px] border-[#2E2E2E] pt-1 mb-4"
    >
      <div
        v-for="item in tabs"
        :key="item.value"
        class="py-2.5 relative text-[#999] hover:text-white text-sm leading-4 font-normal cursor-pointer"
        :class="{
          'text-white selected after:bg-white': activeTab === item.value,
        }"
        @click="() => (activeTab = item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="w-full grow flex space-x-8 pb-6">
      <TradePanelBuyForm :mode="activeTab" />
      <TradePanelSellForm :mode="activeTab" />
    </div>
  </div>
</template>

<style scoped>
.selected::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
