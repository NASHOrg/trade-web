<script setup lang="ts">
const props = defineProps<{
  total: number;
  current: number;
}>();
const emit = defineEmits(['previous', 'next']);
</script>

<template>
  <div
    class="text-white rounded-[3px] px-[13px] py-[8px] text-[14px] w-fit flex flex-row items-center space-x-[12px] border-[2px] border-white"
  >
    <IconPrevious
      class="cursor-pointer"
      :class="{ 'opacity-40': props.current <= 1 }"
      @click="emit('previous')"
    />
    <span>{{ `${props.current} / ${props.total}` }}</span>
    <IconNext
      class="cursor-pointer"
      :class="{ 'opacity-40': props.current >= props.total }"
      @click="emit('next')"
    />
  </div>
</template>
