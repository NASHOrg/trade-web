<script setup lang="ts">
const emits = defineEmits<{
  (e: 'select', value: string): void;
}>();
const { pairs, currentPair } = useNetworkConfig();

const router = useRouter();

const { data } = useNuxtData('order-book');

const cols = computed(() => {
  return [
    { id: 'label', label: 'Pair' },
    // { id: 'type', label: 'Side' },
    { id: 'price', label: 'Price' },
  ];
});

function onSelect(id: string) {
  emits('select', id);
  router.replace({
    path: '/trade',
    query: { ...(router.currentRoute.value.query ?? {}), pair: id },
  });
}
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
        <div
          v-for="token in pairs"
          :key="token.value"
          class="grid grid-cols-2 px-4 py-2 hover:bg-gray-500/20 cursor-pointer transition-[0.2s]"
          :class="{ 'bg-gray-500/10': currentPair?.value === token.value }"
          @click="onSelect(token.value)"
        >
          <span
            v-for="item in cols"
            :key="item.id"
            :class="
              [
                'first:text-start last:text-end text-center',
                'text-[14px] font-normal leading-[14px] first:text-start last:text-end text-center text-ellipsis overflow-hidden',
              ].join(' ')
            "
          >
            <template v-if="item.id === 'label'">
              <div class="flex items-center space-x-1.5">
                <span>{{ token.label }}</span>
              </div>
            </template>
            <template v-else-if="item.id === 'type'">
              <span v-if="token.type === 0">{{ $t("sell") }}</span>
              <span v-else>{{ $t("buy") }}</span>
            </template>
            <template v-else-if="['price'].includes(item.id)">
              {{ formatAmount(data?.latestPrice ?? '0', 5, { format: true }) }}
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
