<script setup lang="ts">
import BN from 'bignumber.js';
import { formatEther } from 'ethers';
import { toast } from 'vue-sonner';
import type { AccountInfo } from '~/types/common';
import { network, stakeApi } from '~/utils/contracts';

const { $botApi } = useNuxtApp();
const { t } = useI18n();
const { address, open, chainId, switchNetwork } = useWallet();

const emit = defineEmits<{
  (
    e: 'update',
    value?: AccountInfo,
  ): void;
}>();

async function getBalance() {
  if (!address.value)
    return {
      balance: '0',
    };
  const balance = await stakeApi.getBalance({ address: address.value });
  return {
    balance: formatEther(balance || '0'),
  };
}

async function getStaking(): Promise<{ [key: string]: string }> {
  if (!address.value) return {};
  const result = await stakeApi.accountVotesForNextEpoch(address.value!);
  return Object.fromEntries(result.ids.map((id, i) => [id, result.amounts[i]!.toString()]));
}

async function getUnstaked() {
  if (!address.value) return {};
  const [currentBlockHeight, numberOfBlocksWaitingBeforeUnlocking, waitingUnlockAmounts] = await Promise.all([
    stakeApi.getBlockNumber(),
    stakeApi.numberOfBlocksWaitingBeforeUnlocking(),
    stakeApi.balanceWaitingUnlockForAccount(address.value),
  ]);

  let unstaked = 0n;
  let incommingUnstaked = 0n;

  waitingUnlockAmounts?.amounts.forEach((amount, index) => {
    const block = waitingUnlockAmounts?.blocks[index];
    if (block && block + numberOfBlocksWaitingBeforeUnlocking! < BigInt(currentBlockHeight)) {
      unstaked += amount;
    }
    else {
      incommingUnstaked += amount;
    }
  });

  return {
    unstaked: formatAmount(formatEther(unstaked), 2),
    incommingUnstaked: formatAmount(formatEther(incommingUnstaked), 2),
  };
}

const { data } = useAsyncData(
  'stake-account-info',
  async () => {
    if (!address.value) return;
    const infos: AccountInfo = {
      myRewards: '0',
      myBalance: '0',
      staking: undefined as { [key: string]: string } | undefined,
      unstaked: '0',
      incommingUnstaked: '0',
      releaseBalance: '0',
    };
    const myRewards = await $botApi.userUserReward({
      ownerAddress: address.value!,
    });
    const { balance } = await getBalance();
    const staking = await getStaking();
    const unstaked = await getUnstaked();

    infos.myRewards = myRewards ?? '0';
    infos.myBalance = balance;
    infos.staking = staking;
    infos.unstaked = unstaked.unstaked ?? '0';
    infos.incommingUnstaked = unstaked.incommingUnstaked ?? '0';
    return infos;
  }, {
    watch: [address],
    immediate: true,
    server: false,
  },
);

const { data: stakedData } = useAsyncData(
  `staked-list-${address.value}-stat`,
  () =>
    $botApi.userUserVoteDevices({
      address: address.value!,
      pageNo: 1,
      pageSize: 100,
    }),
  { watch: [address], server: false },
);

watch(data, () => {
  if (data.value) emit('update', data.value);
});

const totalStaking = computed(() => {
  const staking = data.value?.staking;
  if (!staking || !stakedData.value) return undefined;
  const total = Object.values(staking).reduce(
    (acc, cur) => acc.plus(BN(formatEther(cur))),
    BN(0),
  );
  const totalCurrentStake = stakedData.value.records!.reduce(
    (acc, cur) => acc.plus(BN(formatEther(cur.deviceMyStake))),
    BN(0),
  );
  const diff = total.minus(totalCurrentStake);
  return {
    total: formatAmount(totalCurrentStake.toString(), 2),
    pending:
        diff.gt(0)
          ? `+${formatAmount(diff.toString(), 2)}`
          : diff.lt(0)
            ? `${formatAmount(diff.toString(), 2)}`
            : '',
  };
});

const isRetrieveing = ref<boolean>(false);
async function onRetrieve() {
  isRetrieveing.value = true;
  try {
    const provider = useWallet().provider();
    if (!address.value) {
      return open();
    }
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    const tx = await stakeApi.unlockBalance(provider);
    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
    });
  }
  catch (error) {
    handleJsonRpcError(error, toast);
  }
  finally {
    isRetrieveing.value = false;
  }
}
</script>

<template>
  <div class="card w-full">
    <div class="grid grid-cols-2 gird-flow-col gap-[2px] bg-[#2e2e2e]">
      <div class="col-span-1 px-[50px] flex items-center justify-start bg-black">
        <IconCoinsBalance />
        <div class="ms-[8px] flex flex-col">
          <p>{{ t('balance') }}</p>
          <USkeleton
            v-if="!data"
            class="mt-[10px] h-[16px] w-[80px]"
          />
          <p
            v-else
            class="mt-[10px] text-[16px]"
          >
            <span class="text-primary-500">{{ formatAmount(data.myBalance ?? "0", 2) }}</span>
          </p>
        </div>
      </div>
      <div
        class="min-h-[176px] row-span-2 px-[50px] flex flex-col justify-center relative bg-black"
      >
        <div class="flex w-full justify-between">
          <IconCoinsRewards />
          <UPopover
            mode="hover"
            :popper="{ placement: 'top' }"
          >
            <IconInfo />
            <template #panel>
              <p class="p-2">
                {{ t('stakeTip') }}
              </p>
            </template>
          </UPopover>
        </div>
        <p class="mt-[8px] text-[18px] leading-[20px]">
          {{ t('totalRewards') }}
        </p>
        <USkeleton
          v-if="!data"
          class="mt-[16px] h-[20px] w-[80px]"
        />
        <p
          v-else
          class="mt-[16px] text-primary-500 text-[20px]"
        >
          {{ formatAmount(formatEther(data!.myRewards), 4) }} tBOL
        </p>
      </div>
      <div class="px-[50px] flex items-center justify-start bg-black">
        <IconCoinsStaking />
        <div
          class="ms-[8px] flex flex-col"
        >
          <p>{{ t('staking') }}</p>
          <USkeleton
            v-if="!data"
            class="mt-[10px] h-[16px] w-[80px]"
          />
          <p
            v-else
            class="mt-[10px] text-[16px]"
          >
            <span class="text-primary-500">{{ totalStaking?.total ?? "0" }}</span>
            <span v-if="totalStaking?.pending"> / </span>
            <span
              v-if="totalStaking?.pending"
              class="text-[#0AC491]"
            >
              {{ totalStaking?.pending }}
            </span>
          </p>
        </div>
      </div>
      <div class="px-[50px] py-[20px] flex justify-between items-center bg-black col-span-2">
        <div class="flex items-start justify-start">
          <IconDocumentSearch />
          <div
            class="ms-[8px] flex flex-col text-[16px]"
          >
            <div class="flex space-x-2">
              <p>{{ t('unstaked') }}</p>
              <UPopover
                mode="hover"
                :popper="{ placement: 'top' }"
              >
                <IconInfo />
                <template #panel>
                  <p class="p-2">
                    {{ t('unstakeTip') }}
                  </p>
                </template>
              </UPopover>
            </div>
            <USkeleton
              v-if="!data"
              class="mt-[10px] h-[16px] w-[80px]"
            />
            <p
              v-else
              class="mt-[10px]"
            >
              <span class="text-primary">{{ data.unstaked }}</span>
              <span v-if="data.incommingUnstaked !== '0'"> / </span>
              <span
                v-if="data.incommingUnstaked !== '0'"
                class="text-[#0AC491]"
              >{{ `+${data.incommingUnstaked}` }}</span>
            </p>
          </div>
        </div>
        <UButton
          class="text-[16px]"
          size="sm"
          :loading="isRetrieveing"
          :disabled="Number(data?.unstaked ?? 0) === 0"
          @click="onRetrieve"
        >
          {{ t('retrieve') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
