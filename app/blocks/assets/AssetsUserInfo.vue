<script lang="ts" setup>
import { ethers } from 'ethers';
import { BaseEvmApi } from '~/utils/contracts/api';
import { WithdrawModal, DepositModal, HistoryModal } from '#components';
import PendingTransactionAmount from '~/components/PendingTransactionAmount.vue';

const { address } = useWallet();
const { isMD } = useDevice();
const { network, currentPair } = useNetworkConfig();
const { $authApi } = useNuxtApp();
const { t } = useI18n();
const api = new BaseEvmApi(network.rpc);

const { data } = useAsyncData(`user-assets-${address.value}`, async () => {
  if (!address.value) return;
  const balance = await api.getBalance({ address: address.value });
  return {
    balance,
  };
}, {
  server: false,
  watch: [address],
});

const { userToken } = useToken();
const { data: user } = useAsyncData(
  'user',
  async () => {
    if (!userToken.value) return Promise.resolve(null);
    return $authApi.userUser({}, userToken.value);
  },
  {
    watch: [userToken],
    server: false,
  },
);

const balanceFormat = computed(() => {
  return ethers.formatEther(data.value?.balance || '0');
});

const modal = useModal();
const token = computed(() => currentPair.value.tokens[1]!);

function onDeposit() {
  modal.open(DepositModal, { token: token.value });
}

function onWithdraw() {
  modal.open(WithdrawModal, { token: token.value });
}

function onOpenHistory() {
  modal.open(HistoryModal);
}

const buttons = [
  {
    label: t('deposit'),
    value: 'deposit',
    onClick: onDeposit,
    icon: resolveComponent('IconDeposit'),
  },
  {
    label: t('withdraw'),
    value: 'withdraw',
    onClick: onWithdraw,
    icon: resolveComponent('IconWithdraw'),
  },
];

const inviteLink = computed(() => {
  if (import.meta.server) return '';
  const url = window.location.protocol + '//' + window.location.host;
  return `${url}?ref=${user.value?.userInvitationCode}`;
});
</script>

<template>
  <div
    class="w-full md:p-6 p-3 border-[1px] border-[#2E2E2E] rounded-xl bg-[#121212]"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center md:space-x-5 space-x-2.5">
        <div>
          <AddressIcon
            :address="address || ethers.ZeroAddress"
            :diameter="isMD ? 80 : 40"
          />
        </div>
        <div class="flex flex-col items-start">
          <div
            class="text-white font-bold md:text-[32px] text-lg md:leading-9 leading-6"
          >
            {{ shortAddress(address || "", 5) }}
          </div>
          <div
            class="md:pt-2 pt-1 text-[#999999] md:text-sm text-xs font-normal flex items-center space-x-1"
          >
            <span>{{ shortAddress(address || "", 5) }}</span>

            <CopyButton :source="address || ''" />
          </div>
        </div>
      </div>
      <div
        class="grow pl-2 text-ellipsis text-sm font-medium text-end overflow-hidden whitespace-nowrap"
      >
        <span v-if="!address">
          <ConnectWalletButton />
        </span>
        <span
          v-else
          :title="balanceFormat"
        >
          {{ formatAmount(balanceFormat, 6) }}
          {{ network?.symbol }}
        </span>
      </div>
    </div>
    <div class="inline-flex space-x-[10px] mt-[14px] items-center">
      <span class="text-[16px]">Invitation Link:</span>
      <div class="text-[14px] py-2 px-4 rounded-full bg-[#2e2e2e] inline-flex items-center space-x-2">
        <span>
          {{ inviteLink }}
        </span>
        <CopyButton :source="inviteLink || ''" />
      </div>
    </div>
    <div class="flex space-x-[10px] md:space-x-[32px] mt-[28px]">
      <UButton
        v-for="item in buttons"
        :key="item.value"
        class="rounded-[8px] !bg-[#2e2e2e] !text-white !text-[16px] !border-none"
        color="white"
        @click="item.onClick"
      >
        <component :is="item.icon" />
        <span class="hidden md:block">{{ item.label }}</span>
      </UButton>
      <PendingTransactionAmount>
        <UButton
          class="rounded-[8px] !bg-[#2e2e2e] !text-white !text-[16px] !border-none"
          color="white"
          @click="onOpenHistory"
        >
          <IconHistory />
          <span class="hidden md:block">{{ t('history') }}</span>
        </UButton>
      </PendingTransactionAmount>
    </div>
  </div>
</template>
