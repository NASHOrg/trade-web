<script setup lang="ts">
const { pairs } = useNetworkConfig();

const cols = computed(() => {
  return [
    { id: 'label', label: 'Pair' },
    { id: 'price', label: 'Price' },
  ];
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full px-4 pt-2.5">
      <UInput
        class="h-8"
        placeholder="Search"
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :ui="{
          color: {
            rounded: 'rounded-[4px]',
            white: { outline: 'shadow-none !ring-0 bg-[#1a1a1a]' },
          },
        }"
      />
    </div>

    <div class="grid grid-cols-2 text-[#999999] px-4 pt-4">
      <span
        v-for="item in cols"
        :key="item.id"
        class="col-span-1 text-[14px] font-normal leading-[14px] first:text-start last:text-end text-center"
      >
        {{ item.label }}
      </span>
    </div>

    <div class="w-full py-2 overflow-y-auto scrollbar">
      <div class="w-full">
        <TokenPair
          v-for="item in pairs"
          :key="item.value"
          :pair="item"
        />
      </div>
    </div>
  </div>
</template>
