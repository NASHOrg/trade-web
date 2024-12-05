<script setup lang="ts">
defineProps<{ pair: typeof currentPair.value }>();
const router = useRouter();
const { currentPair } = useNetworkConfig();

function onSelect(id: string) {
  router.replace({
    path: '/trade',
    query: { ...(router.currentRoute.value.query ?? {}), pair: id },
  });
}

const cols = computed(() => {
  return [
    { id: 'label', label: 'Pair' },
    { id: 'price', label: 'Price' },
  ];
});
</script>

<template>
  <div
    class="grid grid-cols-2 px-4 py-2 hover:bg-gray-500/20 cursor-pointer transition-[0.2s]"
    :class="{ 'bg-gray-500/10': currentPair?.value === pair.value }"
    @click="onSelect(pair.value)"
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
          <span>{{ pair.label }}</span>
        </div>
      </template>
      <template v-else-if="['price'].includes(item.id)">
        {{ !pair.price ? '' : formatAmount(pair.price ?? '0', 5, { format: true, endPad: true }) }}
      </template>
    </span>
  </div>
</template>
