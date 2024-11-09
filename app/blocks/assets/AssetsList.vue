<script lang="ts" setup>
const { tokens } = useNetworkConfig();
const { t } = useI18n();
const { address } = useWallet();

const columns = computed(() => {
  return [
    { id: 'assets', label: t('assets') },
    { id: 'balance', label: t('balance') },
    // { id: 'entry', label: t('entry') },
  ];
});

const data = computed(() => {
  return [
    {
      id: 'bool',
      icon: tokens.value.bool.icon,
      name: tokens.value.bool.name,
      type: 'Token',
      token: tokens.value.bool,
    },
    {
      id: 'usdt',
      icon: tokens.value.usdt.icon,
      name: tokens.value.usdt.name,
      type: 'Token',
      token: tokens.value.usdt,
    },
  ];
});
</script>

<template>
  <div
    class="w-full md:px-6 px-3 md:pt-6 pt-3 border-[1px] border-[#2E2E2E] rounded-xl bg-[#121212]"
  >
    <div class="w-full grid grid-cols-2 text-sm font-normal">
      <span
        v-for="item in columns"
        :key="item.id"
        class="text-start last:text-end"
      >
        {{ item.label }}
      </span>
    </div>

    <div
      v-for="(item, index) in data"
      :key="index"
      class="grid grid-cols-2 md:py-9 py-4"
      :class="{ ' border-t-[1px] border-[#2E2E2E]': index > 0 }"
    >
      <div class="flex items-center md:space-x-4 space-x-2">
        <UAvatar
          :src="item.icon"
          size="30"
          class="w-[30px] h-[30px]"
        />
        <div class="inline-flex flex-col">
          <span class="text-sm font-normal leading-4">{{ item.name }}</span>
          <span
            class="text-xs p-0.5 font-normal border-[1px] border-[#999] text-[#999] rounded-sm mt-1 leading-3"
          >
            {{ item.type }}
          </span>
        </div>
      </div>
      <div class="w-full flex justify-end items-center">
        <TokenBalance
          :address="address"
          :token="{
            address: item.token.address,
            decimals: item.token.decimals,
            symbol: item.token.symbol,
          }"
        />
      </div>
    </div>
  </div>
</template>
