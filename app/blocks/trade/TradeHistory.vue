<script setup lang="ts">
const { t } = useI18n();

const tabs = [
  {
    value: 'orders',
    label: t('orders'),
  },
  {
    value: 'history',
    label: t('history'),
  },
];
const selected = ref('orders');
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="flex px-4 justify-start space-x-[30px] border-b-[1px] border-[#2E2E2E] pt-1"
    >
      <div
        v-for="item in tabs"
        :key="item.value"
        class="py-4 relative text-[#999] hover:text-white text-sm leading-4 font-normal cursor-pointer"
        :class="{
          'text-white selected after:bg-white': selected === item.value,
        }"
        @click="selected = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="w-full grow">
      <TradeHistoryActive v-if="selected === 'orders'" />
      <TradeHistoryCompleted v-if="selected === 'history'" />
    </div>
  </div>
</template>

<style scoped>
.selected::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 80%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
