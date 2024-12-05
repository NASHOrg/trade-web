<script setup lang="ts">
const { pairs } = useNetworkConfig();
const { $api } = useNuxtApp();
const cols = computed(() => {
  return [
    { id: 'label', label: 'Pair' },
    { id: 'price', label: 'Price' },
  ];
});
const searchValue = ref<undefined | string>();

// Auto refresh token pairs every 3 seconds to update price
const counter = useInterval(3000);
const { data: tokenPairs } = useAsyncData('token-pairs', async () => {
  const data = await $api.blockchainPairs({});
  if (!data) return;
  return data.map((item: any) => ({
    value: item.name,
    label: item.name,
    price: item.price,
  }));
}, {
  server: false,
  lazy: true,
  watch: [counter],
});

const pairsData = computed(() => {
  const data = tokenPairs.value ?? pairs;
  if (searchValue.value) {
    return data.filter((item: any) => item.label.toLowerCase().includes(searchValue.value!.toLowerCase()));
  }
  return data;
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="relative w-full px-4 pt-2.5">
      <UInput
        v-model="searchValue"
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
      <div
        v-if="searchValue"
        class="absolute right-6 top-4 p-1 cursor-pointer flex items-center justify-center"
        @click="searchValue=undefined"
      >
        <IconClose class="size-[12px]" />
      </div>
      <span v-else />
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
          v-for="item in pairsData"
          :key="item.value"
          :pair="item!"
        />
      </div>
    </div>
  </div>
</template>
