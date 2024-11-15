<script lang="ts" setup>
import { WithdrawModal, DepositModal } from '#components';

const { network, tokens } = useNetworkConfig();
const { t } = useI18n();
const { address } = useWallet();

const columns = computed(() => {
  return [
    { id: 'assets', label: t('assets') },
    { id: 'balance', label: t('balance') },
    { id: 'entry', label: t('entry') },
  ];
});

const data = computed(() => {
  return Object.values(network.value.bridge)
    .filter(item => item.length > 1) // filter out empty list
    .map((item) => {
      const token = item.find(
        t => t.chainId === network.value.chainId,
      )?.tokens;
      return {
        id: token?.name ?? '',
        icon: token?.icon ?? '',
        name: token?.name ?? '',
        type: 'Token',
        token: token!,
      };
    });
});

const modal = useModal();

function onDeposit(token: (typeof data.value)[number]['token']) {
  modal.open(DepositModal, { token });
}

function onWithdraw(token: (typeof data.value)[number]['token']) {
  modal.open(WithdrawModal, { token });
}
</script>

<template>
  <div
    class="w-full md:px-6 px-3 md:pt-6 pt-3 border-[1px] border-[#2E2E2E] rounded-xl bg-[#121212]"
  >
    <div class="w-full grid grid-cols-3 text-sm font-normal">
      <span
        v-for="item in columns"
        :key="item.id"
        class="first:text-start last:text-end text-center"
      >
        {{ item.label }}
      </span>
    </div>
    <div
      class="grid grid-cols-3 md:py-9 py-4"
    >
      <div class="flex items-center md:space-x-4 space-x-2">
        <UAvatar
          :src="tokens.bool.icon"
          class="w-[30px] h-[30px]"
        />
        <div class="inline-flex flex-col">
          <span class="text-sm font-normal leading-4">{{ tokens.bool.name }}</span>
          <span
            class="text-xs p-0.5 font-normal border-[1px] border-[#999] text-[#999] rounded-sm mt-1 leading-3"
          >
            Token
          </span>
        </div>
      </div>
      <div class="w-full flex justify-center items-center">
        <TokenBalance
          :address="address"
          :token="{
            address: tokens.bool.address,
            decimals: tokens.bool.decimals,
            symbol: tokens.bool.symbol,
          }"
        />
      </div>
      <div class="flex flex-col justify-end items-end space-y-2.5" />
    </div>

    <div
      v-for="(item, index) in data"
      :key="index"
      class="grid grid-cols-3 md:py-9 py-4 border-t-[1px] border-[#2E2E2E]"
    >
      <div class="flex items-center md:space-x-4 space-x-2">
        <UAvatar
          :src="item.icon"
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
      <div class="w-full flex justify-center items-center">
        <TokenBalance
          :address="address"
          :token="{
            address: item.token.address,
            decimals: item.token.decimals,
            symbol: item.token.symbol,
          }"
        />
      </div>
      <div class="flex flex-col justify-end items-end space-y-2.5">
        <UButton
          color="black"
          variant="outline"
          class="w-[95px] h-[30px] items-center justify-center text-xs font-normal leading-[14px]"
          :ui="{ rounded: 'rounded-[4px]', padding: { md: 'p-0' } }"
          @click="onWithdraw(item.token)"
        >
          {{ t("withdraw") }}
        </UButton>
        <UButton
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
          @click="onDeposit(item.token)"
        >
          {{ t("deposit") }}
        </UButton>
      </div>
    </div>
  </div>
</template>
