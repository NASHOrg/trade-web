<script setup lang="ts">
defineProps<{
  title?: string;
  content?: string | number | globalThis.VNode;
  confirmText?: string;
  cancelText?: string;
}>();

const modal = useModal();
const emit = defineEmits(['cancel', 'confirm']);

const onCancel = async () => {
  emit('cancel');
  modal.close();
};

const onConfirm = async () => {
  emit('confirm');
  modal.close();
};

const isComponent = (node: globalThis.VNode | string | number) => {
  return Boolean((node as any)?.__v_isVNode);
};
</script>

<template>
  <UModal>
    <div class="p-4">
      <h1>{{ title ?? "Hint" }}</h1>
      <slot>
        <div class="w-full text-center py-[20px]">
          <component
            :is="content"
            v-if="content && isComponent(content)"
          />
          <span v-else>{{ content }}</span>
        </div>
      </slot>

      <div class="w-full flex gap-2 justify-end">
        <UButton
          color="gray"
          variant="solid"
          @click="onCancel"
        >
          {{ cancelText ?? "Cancel" }}
        </UButton>
        <UButton
          type="primary"
          @click="onConfirm"
        >
          {{ confirmText ?? "Confirm" }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>
