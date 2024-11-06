<script setup lang="ts">
const emits = defineEmits<{
  (e: 'select', value: string): void;
}>();
const tradeStore = useTradeStore();
const { tokenOptions } = tradeStore;
const { currantToken } = storeToRefs(tradeStore);

const router = useRouter();

const cols = computed(() => {
  return [
    { id: 'label', label: 'Pair' },
    { id: 'type', label: 'Side' },
    { id: 'price', label: 'Price' },
  ];
});

function onSelect(id: string) {
  emits('select', id);
  router.replace(`/trade/${id}`);
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

    <div class="grid grid-cols-8 text-[#999999] px-4 pt-4">
      <span
        v-for="item in cols"
        :key="item.id"
        class="first:col-span-4 last:col-span-3 col-span-1 text-xs font-normal leading-[14px] first:text-start last:text-end text-center"
      >
        {{ item.label }}
      </span>
    </div>

    <div class="w-full py-2 overflow-y-auto scrollbar">
      <div class="w-full">
        <div
          v-for="token in tokenOptions"
          :key="token.value"
          class="grid grid-cols-8 px-4 py-2 hover:bg-gray-500/20 cursor-pointer transition-[0.2s]"
          :class="{ ' bg-gray-500/10': currantToken?.value === token.value }"
          @click="onSelect(token.value)"
        >
          <span
            v-for="item in cols"
            :key="item.id"
            :class="
              [
                'first:col-span-4 last:col-span-3 col-span-1',
                'text-xs font-normal leading-[14px] first:text-start last:text-end text-center text-ellipsis overflow-hidden',
              ].join(' ')
            "
          >
            <template v-if="item.id === 'label'">
              <div class="flex items-center space-x-1.5">
                <!-- <UIcon
                  name="i-mingcute-star-fill"
                  size="12"
                  class="bg-[#404040] min-w-3 h-3 text-[12px]"
                /> -->
                <span>{{ token.label }}</span>
              </div>
            </template>
            <template v-else-if="item.id === 'type'">
              <span v-if="token.type === 0">{{ $t("sell") }}</span>
              <span v-else>{{ $t("buy") }}</span>
            </template>
            <template v-else-if="['price'].includes(item.id)">
              {{ token[item.id] }}
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
