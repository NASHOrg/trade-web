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
  <div class="card w-full p-[20px] pt-[30px]">
    <div class="flex justify-start space-x-[30px] mb-[20px]">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="relative text-[#999] hover:text-white text-[24px] pb-[10px] cursor-pointer"
        :class="{ 'text-white selected after:bg-white': selected === item.value }"
        @click="() => selected = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <TradeHistoryActive v-show="selected === 'orders'" />
    <TradeHistoryCompleted v-show="selected === 'history'" />
  </div>
</template>

<style scoped>
.selected::after {
  content: '';
  position: absolute;
  height: 2px;
  width: 80%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
