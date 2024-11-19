<script setup lang="ts">
const props = defineProps<{
  data: {
    high: number;
    low: number;
    open: number;
    close: number;
    time: number;
    value: number;
  };
}>();

const { currentPair } = useNetworkConfig();
const colorStyle = computed(() => {
  return { color: props.data.open > props.data.close ? '#E24444' : '#0AC49E' };
});
</script>

<template>
  <div class="text-white inline-flex space-x-3 text-sm font-normal flex-wrap mr-[100px] md:mr-0">
    <span class="hidden md:block">{{ currentPair.label }}</span>
    <span>
      <span>O&nbsp;</span>
      <span :style="colorStyle">
        {{ formatAmount(data.open, 5, { endPad: true }) }}
      </span>
    </span>
    <span>
      <span>H&nbsp;</span>
      <span :style="colorStyle">
        {{ formatAmount(data.high, 5, { endPad: true }) }}
      </span>
    </span>
    <span>
      <span>L&nbsp;</span>
      <span :style="colorStyle">
        {{ formatAmount(data.low, 5, { endPad: true }) }}
      </span>
    </span>
    <span>
      <span>C&nbsp;</span>
      <span :style="colorStyle">
        {{ formatAmount(data.close, 5, { endPad: true }) }}
      </span>
    </span>
    <span>
      <span>Vol&nbsp;</span>
      <span :style="colorStyle">
        {{ formatAmount(data.value, 2, { endPad: true }) }}
      </span>
    </span>
  </div>
</template>
