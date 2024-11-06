<script lang="ts" setup>
const { t } = useI18n();
const activeTab = ref<'limit' | 'market'>('limit');
const { isXL } = useDevice();

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

const selectedMode = ref('buy');
const tradeFormModes = computed(() => {
  return [
    { value: 'buy', label: t('buy') },
    { value: 'sell', label: t('sell') },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col lg:px-4 md:px-2">
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

    <div
      v-if="!isXL"
      class="w-full flex justify-between items-center pt-3 py-5"
    >
      <span>Side</span>
      <div class="flex justify-end space-x-[10px]">
        <div
          v-for="item in tradeFormModes"
          :key="item.value"
          class="flex items-center gap-2 cursor-pointer"
          @click="selectedMode = item.value"
        >
          <IconActiveRadio
            v-if="selectedMode === item.value"
            class="size-[16px] text-white"
          />
          <IconInactiveRadio
            v-else
            class="size-[16px]"
          />
          <span
            :class="selectedMode === item.value ? 'text-white' : 'text-[#999]'"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="isXL"
      class="w-full grow flex space-x-8 pb-6"
    >
      <TradePanelBuyForm :mode="activeTab" />
      <TradePanelSellForm :mode="activeTab" />
    </div>
    <div v-else>
      <TradePanelBuyForm
        v-if="selectedMode === 'buy'"
        :mode="activeTab"
      />
      <TradePanelSellForm
        v-else-if="selectedMode === 'sell'"
        :mode="activeTab"
      />
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
