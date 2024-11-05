<script setup lang="ts">
const props = defineProps<{
  total: number;
  current: number;
  disabled: boolean;
}>();
const emit = defineEmits<{
  (e: 'change', value: number): void;
  (e: 'update:current', value: number): void;
}>();

function onChange(type: 'previous' | 'next') {
  if (props.disabled) return;
  if (type === 'previous') {
    if (props.current > 1) {
      emit('change', props.current - 1);
      emit('update:current', props.current - 1);
    }
  }
  else {
    if (props.current < props.total) {
      emit('change', props.current + 1);
      emit('update:current', props.current + 1);
    }
  }
}
</script>

<template>
  <div
    class="text-white rounded-[3px] px-[13px] py-[8px] text-[14px] w-fit flex flex-row items-center space-x-[12px] border-[2px] border-white"
  >
    <IconPrevious
      class="cursor-pointer"
      :class="{ 'opacity-40': props.current <= 1 || disabled }"
      @click.stop="onChange('previous')"
    />
    <span>{{ `${props.current} / ${props.total}` }}</span>
    <IconNext
      class="cursor-pointer"
      :class="{ 'opacity-40': props.current >= props.total || disabled }"
      @click.stop="onChange('next')"
    />
  </div>
</template>
