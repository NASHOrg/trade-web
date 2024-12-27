<script lang="ts" setup>
import { WithdrawModal, DepositModal } from '#components';
import type { Token } from '~/types/common';

const { tokens } = useNetworkConfig();
const { t } = useI18n();
const { address } = useWallet();

const columns = computed(() => {
  return [
    { id: 'assets', label: t('assets') },
    { id: 'balance', label: t('balance') },
    { id: 'entry', label: t('entry') },
  ];
});

const modal = useModal();

function onDeposit(token: Token) {
  modal.open(DepositModal, { token });
}

function onWithdraw(token: Token) {
  modal.open(WithdrawModal, { token });
}
</script>

<template>
  <div
    class="w-full md:px-6 px-3 md:pt-6 pt-3 border-[1px] border-[#2E2E2E] rounded-xl bg-[#121212]"
  >
    <div class="w-full grid grid-cols-[100px_1fr_100px] text-sm font-normal">
      <span
        v-for="item in columns"
        :key="item.id"
        class="text-center"
      >
        {{ item.label }}
      </span>
    </div>
    <div
      v-for="(item, index) in tokens"
      :key="index"
      class="grid grid-cols-3 md:py-9 py-4 border-b-[1px] border-[#2E2E2E] last:border-none"
    >
      <div class="flex items-center md:space-x-4 space-x-2">
        <UAvatar
          :src="item.icon"
          class="w-[30px] h-[30px]"
        />
        <div class="inline-flex flex-col">
          <span class="text-sm font-normal leading-4">{{ item.name }}</span>
        </div>
      </div>
      <div class="w-full flex justify-center items-center">
        <TokenBalance
          :address="address"
          :token="{
            address: item.address,
            decimals: item.decimals,
            symbol: item.symbol,
          }"
        />
      </div>
      <div
        v-if="item.symbol === 'USDC'"
        class="flex flex-col justify-end items-end space-y-2.5"
      >
        <UButton
          v-if="item.address"
          color="black"
          variant="outline"
          class="w-[95px] h-[30px] items-center justify-center text-xs font-normal leading-[14px]"
          :ui="{ rounded: 'rounded-[4px]', padding: { md: 'p-0' } }"
          @click="onWithdraw(item)"
        >
          {{ t("withdraw") }}
        </UButton>
        <UButton
          v-if="item.address"
          color="primary"
          variant="outline"
          class="w-[95px] h-[30px] items-center justify-center text-xs font-normal leading-[14px]"
          :ui="{
            rounded: 'rounded-[4px]',
            padding: { md: 'p-0' },
            variant: {
              outline: 'bg-primary/30 dark:bg-primary/30',
            },
          }"
          @click="onDeposit(item)"
        >
          {{ t("deposit") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
