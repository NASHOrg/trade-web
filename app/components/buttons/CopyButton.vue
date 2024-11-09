<script setup lang="ts">
const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const { copy, copied } = useClipboard({ source: props.source, legacy: true });
</script>

<template>
  <UTooltip
    v-if="copied"
    text="Copied"
  >
    <div
      class="cursor-pointer flex"
    >
      <UIcon
        name="i-lucide-copy"
        size="14"
      />
    </div>
  </UTooltip>
  <UTooltip
    v-else
    text="Copy to clipboard"
  >
    <div
      class="cursor-pointer flex"
      @click.stop="copy(source)"
    >
      <UIcon
        name="i-lucide-copy"
        :size="14"
      />
    </div>
  </UTooltip>
</template>
