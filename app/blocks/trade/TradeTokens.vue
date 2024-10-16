<script setup lang="ts">
const options = [{
  value: 'usdc',
  label: 'BOOL/USDC',
}, {
  value: 'usdt',
  label: 'BOOL/USDT',
}, {
  value: 'btu',
  label: 'BOOL/BTU',
}];

const selected = ref('usdc');
function onSelect(item: string) {
  selected.value = item;
}
</script>

<template>
  <div class="w-full card py-[40px] px-[30px] text-[24px]">
    <div class="flex justify-between">
      <div
        v-for="item in options"
        :key="item.value"
        class="flex items-center gap-2 cursor-pointer"
        @click="onSelect(item.value)"
      >
        <IconActiveRadio
          v-if="selected === item.value"
          class="size-[20px] text-primary"
        />
        <IconInactiveRadio
          v-else
          class="size-[20px]"
        />
        <span
          :class="selected === item.value ? 'text-primary' : 'text-[#999]'"
        >{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
