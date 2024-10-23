<script setup lang="ts">
const value = defineModel<number>();
const points = [
  {
    value: 0,
    position: 'start-0',
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
  <div class="w-full relative flex items-center">
    <URange
      v-model:model-value="value"
      :min="0"
      :max="100"
      :step="1"
      :ui="{
        progress: {
          size: {
            md: 'h-[2px]',
          },
          background: 'bg-white dark:bg-white',
        },
        thumb: {
          background:
            '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:dark:bg-gray-900 [&::-moz-range-thumb]:bg-current',
          ring: '[&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-white',
          size: {
            md: '[&::-webkit-slider-thumb]:h-2 [&::-moz-range-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-moz-range-thumb]:w-2 [&::-webkit-slider-thumb]:-mt-[3px] [&::-moz-range-thumb]:-mt-[3px]',
          },
        },
        track: {
          size: {
            md: '[&::-webkit-slider-runnable-track]:h-[2px] [&::-moz-range-track]:h-[2px]',
          },
          background:
            '[&::-webkit-slider-runnable-track]:bg-[#242424] [&::-moz-range-track]:bg-[#242424] [&::-webkit-slider-runnable-track]:dark:bg-[#242424] [&::-moz-range-track]:dark:bg-[#242424]',
        },
      }"
    />
    <div
      class="w-full absolute flex items-center justify-between pointer-events-none"
    >
      <div
        v-for="item in points"
        :key="item.value"
        class="cursor-pointer size-2 rounded-full first:translate-x-[-1px] last:translate-x-[1px]"
        :class="`${
          (value ?? 0) > item.value
            ? 'bg-white  border-[2px] border-white'
            : 'bg-[#333] border-[2px] border-[#242424]'
        }`"
        @click="value = item.value"
      />
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-[10px] h-[10px] bg-[#242424] outline outline-[6px] outline-white rounded-full cursor-pointer transition-shadow hover:drop-shadow-lg ease-in-out;
}

input[type="range"] {
  @apply appearance-none h-[2px] bg-[#242424] rounded-full;
}
</style>
