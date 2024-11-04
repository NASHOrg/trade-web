<script setup lang="ts">
const props = defineProps<{
  value?: number;
}>();

const emit = defineEmits<{
  (e: 'change', value?: string | number): void;
  (e: 'update:value', value?: string | number): void;
}>();
// const value = defineModel<number>();
const modalValue = ref(0);
const modalValueCom = computed({
  get: () => props.value ?? modalValue.value,
  set: (val) => {
    modalValue.value = val;
    emit('change', val);
    emit('update:value', val);
  },
});
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
      v-model="modalValueCom"
      :min="0"
      :max="100"
      :step="1"
      :ui="{
        base: '!h-2',
        progress: {
          size: {
            md: 'h-[2px]',
          },
          background: ' bg-white dark:bg-white',
        },
        thumb: {
          background:
            '[&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-black dark:[&::-moz-range-thumb]:bg-black ',
          size: {
            md: '[&::-webkit-slider-thumb]:h-1.5 [&::-moz-range-thumb]:h-1.5 [&::-webkit-slider-thumb]:w-1.5 [&::-moz-range-thumb]:w-1.5 [&::-webkit-slider-thumb]:-mt-[2.5px] [&::-moz-range-thumb]:-mt-[2.5px]',
          },
          ring: '[&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:ring-white',
        },
        track: {
          size: {
            md: '[&::-webkit-slider-runnable-track]:h-[1.5px] [&::-moz-range-track]:h-[1.5px] ',
          },
          background:
            ' [&::-webkit-slider-runnable-track]:bg-[#383838] [&::-moz-range-track]:bg-[#383838] [&::-webkit-slider-runnable-track]:dark:bg-[#383838] [&::-moz-range-track]:dark:bg-[#383838]',
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
          (modalValueCom ?? 0) > item.value
            ? 'bg-black  border-[1px] border-white'
            : 'bg-black border-[1px] border-[#383838]'
        }`"
        @click="modalValueCom = item.value"
      />
    </div>
  </div>
</template>
