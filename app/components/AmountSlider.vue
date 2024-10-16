<script setup lang="ts">
const value = defineModel<number>();
const points = [
  {
    value: 0,
    potition: 'start-0',
  },
  {
    value: 25,
    position: 'start-1/4 translate-x-[-4px]',
  },
  {
    value: 50,
    position: 'start-2/4 translate-x-[-4px]',
  },
  {
    value: 75,
    position: 'start-3/4 translate-x-[-4px]',
  },
  {
    value: 100,
    position: 'end-0',
  },

];
</script>

<template>
  <div class="w-full relative">
    <input
      v-model="value"
      type="range"
      class="w-full"
      min="1"
      max="100"
      step="1"
    >
    <div
      v-for="item in points"
      v-show="Math.abs(item.value - (value ?? 0)) > 5"
      :key="item.value"
      class="cursor-pointer size-[8px] rounded-full absolute"
      :class="`${item.value > (value ?? 0) ? 'bg-[#333] border-[2px] border-[#242424] bottom-[-1px]': 'bg-white bottom-[-2px]'} ${item.position}`"
      @click="value = item.value"
    />
    <div
      class="absolute bg-white h-[2px] translate-y-[-4px] rounded-full"
      :style="{ width: `calc(${(value ?? 0).toString()}% - 8px)` }"
    />
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
    @apply appearance-none w-[10px] h-[10px] bg-[#242424] outline outline-[6px] outline-white rounded-full cursor-pointer transition-shadow hover:drop-shadow-lg ease-in-out;
  }

input[type=range] {
    @apply appearance-none h-[2px] bg-[#242424] rounded-full;
  }
</style>
