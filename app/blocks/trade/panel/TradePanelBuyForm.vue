<script setup lang="ts">
const state = reactive({
  price: undefined,
  quantity: undefined,
});

const modes = [
  {
    value: 'limit',
    label: 'Limit',
  },
  {
    value: 'market',
    label: 'Market',
  },
];
const selectedMode = ref('limit');
</script>

<template>
  <div class="form-item">
    <span>Mode</span>
    <div class="flex justify-end space-x-[10px]">
      <div
        v-for="item in modes"
        :key="item.value"
        class="flex items-center gap-2 cursor-pointer"
        @click="selectedMode= item.value"
      >
        <IconActiveRadio
          v-if="selectedMode === item.value"
          class="size-[16px] text-white"
        />
        <IconInactiveRadio
          v-else
          class="size-[16px]"
        />
        <span
          :class="selectedMode === item.value ? 'text-white' : 'text-[#999]'"
        >{{ item.label }}</span>
      </div>
    </div>
  </div>
  <div
    v-if="selectedMode === 'limit'"
    class="form-item"
  >
    <span>Price</span>
    <div class="flex justify-end items-center">
      <CustomInput
        v-model="state.price"
        placeholder="0.0"
        class="!text-[16px]"
      />
      <span
        class="text-white"
      >
        USDT</span>
    </div>
  </div>
  <div class="form-item">
    <span>Qty</span>
    <div class="flex justify-end items-center">
      <CustomInput
        v-model="state.quantity"
        placeholder="0.0"
        class="!text-[16px]"
      />
      <span
        class="text-white"
      >
        BOOL</span>
    </div>
  </div>
  <div class="form-item">
    <span>Value</span>
    <div class="flex justify-end items-center space-x-[10px]">
      <span>0.0</span>
      <span
        class="text-white"
      >
        USDT</span>
    </div>
  </div>
  <div class="flex justify-between items-center mt-[6px]">
    <span class="text-white text-[14px]">Balance: 440.3456 USDT</span>
    <UButton
      to=""
      variant="outline"
      size="xs"
      class="mt-[6px] rounded-[4px] h-[22px] text-[12px]"
    >
      Add Fund
    </UButton>
  </div>
  <UButton
    color="buy"
    block
    class="h-[44px] rounded-[8px]"
  >
    Buy Bool
  </UButton>
</template>

<style scoped>
.form-item {
  @apply h-[40px] bg-[#242424] text-[#999] rounded-[4px] flex justify-between items-center px-[16px] text-[16px]
}
</style>
