<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string;
    showClose?: boolean;
    ui?: any;
  }>(),
  {
    showClose: true,
    title: undefined,
  },
);
const emit = defineEmits<{
  (e: 'closed'): void;
}>();
const modal = useModal();

const onClose = () => {
  modal.close();
  emit('closed');

  // 99,868.68876473 TDO
  // 99,873.32075 TDO

  // 4.63198527

  // 1.17174909 SHQU
  // 3.63025764 SHQU

  // 2.45850855

  // 4.91741587
  // 9.27945511

  // 2.45870794
  // 4.63972756
};
</script>

<template>
  <UModal :ui="ui ?? { width: `w-full !max-w-[560px]` }">
    <div class="w-full rounded-[12px] overflow-hidden relative">
      <div class="w-full md:px-6 px-3 relative">
        <div
          v-if="title"
          class="w-full md:py-6 py-3 text-white text-base font-normal text-ellipsis overflow-hidden text-nowrap border-[#2E2E2E] border-b-[1px]"
        >
          <span>{{ title ?? "" }}</span>
        </div>
        <div
          v-if="showClose"
          class="absolute top-4 right-4 cursor-pointer"
          @click="onClose"
        >
          <IconClose class="w-[18px] h-[18px]" />
        </div>
      </div>

      <div class="w-full min-h-[300px] md:py-4 py-2">
        <slot />
      </div>
    </div>
  </UModal>
</template>
