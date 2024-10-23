<script setup lang="ts">
const tradeStore = useTradeStore();
const { tokenOptions } = tradeStore;
const { currantToken } = storeToRefs(tradeStore);

const router = useRouter();
function onSelect(item: string) {
  router.replace({
    query: { token: item },
  });
}
</script>

<template>
  <div class="w-full card py-[40px] px-[30px] text-[24px]">
    <div class="flex justify-between">
      <div
        v-for="item in tokenOptions"
        :key="item.value"
        class="flex items-center gap-2 cursor-pointer"
        @click="onSelect(item.value)"
      >
        <IconActiveRadio
          v-if="currantToken.value === item.value"
          class="size-[20px] text-primary"
        />
        <IconInactiveRadio
          v-else
          class="size-[20px]"
        />
        <span
          :class="currantToken.value === item.value ? 'text-primary' : 'text-[#999]'"
        >{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
