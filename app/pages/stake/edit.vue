<script lang="ts" setup>
import { formatEther } from 'ethers';
import BN from 'bignumber.js';
import { toast } from 'vue-sonner';
import { formatAmount } from '~/utils/helpers';
import { network, stakeApi } from '~/utils/contracts';

const { query } = useRoute();
const router = useRouter();
const { t } = useI18n();
const { address, open, chainId, switchNetwork } = useWallet();

const {
  dhcDID,
  totalStaking,
  totalVoters,
  annualYield,
  currentStaking,
  availableBalance,
  devices,
  stakeAmountList,
} = query as {
  dhcDID: string;
  totalStaking: string;
  totalVoters: string;
  annualYield: string;
  currentStaking?: string;
  availableBalance: string;
  devices: string[];
  stakeAmountList: string[];
  allowVote?: string;
};

const amountField = ref<string | undefined>(currentStaking ? formatEther(currentStaking) : undefined);
const removeStake = ref(false);

function stakeAll() {
  amountField.value = BN(availableBalance)
    .plus(BN(formatEther(currentStaking ?? '0')))
    .dp(2, 1)
    .toString();
}

const isStaking = ref(false);
async function onStake() {
  const amountList = stakeAmountList.map(amount => formatEther(amount));
  const index = devices.indexOf(dhcDID);
  const deviceId = [...devices];
  isStaking.value = true;
  if (removeStake.value) {
    amountList[index] = '0';
  }
  else {
    if (!amountField.value) return;
    let value = Number(amountField.value.replaceAll(',', ''));
    if (value < 200) {
      toast.warning(t('numOfTBOLAtLeastHint', { num: 200 }));
      isStaking.value = false;
      return;
    }
    if (index !== -1) {
      const diff = value! - Number(amountList[index]);
      if (BN(diff).gt(BN(availableBalance))) {
        toast.warning(t('insufficientBolBalance'));
        isStaking.value = false;
        return;
      }
      if (BN(availableBalance).minus(BN(diff)).lt(0.00025)) {
        value -= 0.00025;
      }
      amountList[index] = value.toString();
    }
    else {
      if (BN(value).gt(BN(availableBalance))) {
        toast.warning(t('insufficientBolBalance'));
        isStaking.value = false;
        return;
      }
      if (BN(availableBalance).minus(BN(value)).lt(0.00025)) {
        value -= 0.00025;
      }
      deviceId.push(dhcDID);
      amountList.push(value.toString());
    }
  }
  try {
    const provider = useWallet().provider();
    if (!address.value) {
      return open();
    }
    if (chainId.value !== Number(network.chainId)) {
      const result = await switchNetwork(Number(network.chainId));
      if (!result) return;
    }
    const tx = await stakeApi.vote(provider, {
      devices: deviceId,
      stakeAmountList: amountList,
    });
    toast.promise(tx.wait(), {
      loading: t('sendTransaction'),
      success: () => {
        refreshNuxtData();
        return t('transactionSuccess');
      },
      error: () => t('transactionFail'),
    });
    router.back();
  }
  catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('missing revert data')) {
        toast.warning(t('fullStaked'));
        router.back();
      }
      else {
        toast.warning(t('transactionFail'));
      }
    }
    else {
      toast.warning(t('transactionFail'));
    }
  }
  finally {
    isStaking.value = false;
  }
}
</script>

<template>
  <div class="card w-full h-full flex flex-col px-[30px]">
    <div class="w-full flex items-center justify-center mt-[40px] mb-[30px]">
      <h1
        class="text-[24px] text-[#333] dark:text-white"
      >
        {{ t("dhcStaking") }}
      </h1>
    </div>
    <div
      class="flex flex-col space-y-[16px] px-[16px] py-[26px] text-[18px] rounded-[6px] border border-black dark:border-white bg-[#EEE] dark:bg-[#121212]"
    >
      <div class="flex justify-between items-center">
        <span>
          DHC DID:
        </span>
        <span>
          {{ shortAddress(dhcDID, 6) }}
        </span>
      </div>
      <div class="flex justify-between">
        <p>
          {{ t("totalStaking") }}:
        </p>
        <p>
          {{ formatAmount(formatEther(totalStaking ?? "0")) }}
        </p>
      </div>
      <div class="flex justify-between">
        <p>
          {{ t("totalVoters") }}:
        </p>
        <span>
          {{ totalVoters }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span>
          {{ t("annualYield") }}:
        </span>
        <div class="flex flex-row items-center">
          <UPopover :popper="{ placement: 'top' }">
            <UIcon
              class="text-primary-500 mt-[6px]"
              name="ic:outline-info"
            />
            <template #panel>
              <div class="p-2 text-[12px]">
                {{ t("annualYieldDesc") }}
              </div>
            </template>
          </UPopover>
          <p
            v-if="annualYield"
            class="ms-[5px]"
          >
            {{ (Number(annualYield) * 100).toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
    <div
      class="space-y-[16px] mt-[16px] py-[26px] px-[16px] flex flex-col text-[18px] rounded-[6px] border border-[#D5D5D5] dark:border-white bg-[#EEE] dark:bg-[#121212]"
    >
      <div class="flex justify-between">
        <p>
          {{ t("myStaking") }}:
        </p>
        <p class="text-primary">
          {{ formatAmount(formatEther(currentStaking ?? "0"), 2) }} tBOL
        </p>
      </div>
      <div class="flex justify-between">
        <p>
          {{ t("availableBalance") }}:
        </p>
        <p class="text-primary">
          {{ formatAmount(availableBalance ?? "0", 2) }} tBOL
        </p>
      </div>
    </div>
    <div class="mt-[28px] flex justify-between text-[20px]">
      <h1>
        {{ t("updateStaking") }}
        <span
          :padded="false"
          class="ml-2 text-[16px] text-primary"
          @click="stakeAll"
        >
          {{ t("max") }}
        </span>
      </h1>
      <button
        v-show="Number(currentStaking) > 0"
        class="flex items-center text-[12px] space-x-1"
        @click="removeStake = !removeStake"
      >
        <template v-if="!removeStake">
          <IconRemove />
          <span class="text-primary-500">{{ t('unstakeAll') }}</span>
        </template>
        <template v-else>
          <IconUndo />
          <span class="text-[#0AC491]">{{ t('cancelUnstake') }}</span>
        </template>
      </button>
    </div>
    <CustomInput
      v-if="!removeStake"
      v-model="amountField"
      :placeholder="t('mustBiggerTanNumOfTBOL', { num: 200 })"
      :disabled="query.allowVote === 'false'"
      input-class="!text-[16px] !bg-white !text-black mt-[16px] !h-[40px]"
    />
    <div
      v-else
      class="mt-[16px] flex bg-[#F5F5F5] ring-1 ring-inset ring-[#C4C4C4] rounded-[8px] px-[16px] py-[10px] text-[14px] leading-[16px] text-[#999]"
    >
      <IconDisable class="me-[8px]" />
      {{ t("unstakeTheDHC") }}
    </div>
    <div
      v-if="removeStake"
      class="flex justify-center items-center mt-[12px] space-x-2"
    >
      <IconHelp />
      <p class="text-[16px] text-[#999] dark:text-white">
        {{ removeStake ? t('unstakeHint') : t('votedNodeHasClosed') }}
      </p>
    </div>
    <div class="mt-[83px] mb-[50px] grid grid-cols-2 justify-center space-x-[34px] mx-[60px]">
      <UButton
        color="black"
        variant="outline"
        block
        class="h-[44px]"
        @click="router.back"
      >
        {{ t("cancel") }}
      </UButton>
      <UButton
        :disabled="
          (amountField === undefined
            || Number(amountField) < 0
            || Number(amountField) === Number(formatEther(currentStaking ?? 0)))
            && !removeStake
        "
        color="black"
        :loading="isStaking"
        block
        class="h-[44px]"
        @click="onStake"
      >
        {{ t("confirm") }}
      </UButton>
    </div>
  </div>
</template>
