<script lang="ts" setup>
// import Decimal from 'decimal.js';
import { formatEther } from 'ethers';
// import { toast } from 'vue-sonner';
// import { d, formatAmount } from '~/utils/helpers';

// const { query } = useRoute();
const router = useRouter();
// const { $api } = useNuxtApp();
const { t } = useI18n();

// const {
//   dhcDID,
//   totalStaking,
//   totalVoters,
//   annualYield,
//   currentStaking,
//   availableBalance,
//   devices,
//   stakeAmountList,
// } = query as {
//   dhcDID: string;
//   totalStaking: string;
//   totalVoters: string;
//   annualYield: string;
//   currentStaking?: string;
//   availableBalance: string;
//   devices: string[];
//   stakeAmountList: string[];
//   allowVote?: string;
// };

const currentStaking = 0;

const amountField = ref<string | undefined>(currentStaking ? formatEther(currentStaking) : undefined);
const removeStake = ref(false);

const stakeProcessing = ref(false);

function stakeAll() {
  // amountField.value = d(availableBalance)
  //   .add(d(formatEther(currentStaking ?? '0')))
  //   .toDP(2, Decimal.ROUND_DOWN)
  //   .toString();
}

async function confirmBtnOnTap() {
//   const amountList = stakeAmountList.map(amount => formatEther(amount));
//   const index = devices.indexOf(dhcDID);
//   const deviceId = [...devices];
//   stakeProcessing.value = true;
//   if (removeStake.value) {
//     amountList[index] = '0';
//   }
//   else {
//     if (!amountField.value) return;
//     let value = Number(amountField.value.replaceAll(',', ''));
//     if (value < 200) {
//       toast.warning(t('numOfTBOLAtLeastHint', { num: 200 }));
//       stakeProcessing.value = false;
//       return;
//     }
//     if (index !== -1) {
//       const diff = value! - Number(amountList[index]);
//       if (d(diff).gt(d(availableBalance))) {
//         toast.warning(t('insufficientBolBalance'));
//         stakeProcessing.value = false;
//         return;
//       }
//       if (d(availableBalance).minus(d(diff)).lt(0.00025)) {
//         value -= 0.00025;
//       }
//       amountList[index] = value.toString();
//     }
//     else {
//       if (d(value).gt(d(availableBalance))) {
//         toast.warning(t('insufficientBolBalance'));
//         stakeProcessing.value = false;
//         return;
//       }
//       if (d(availableBalance).minus(d(value)).lt(0.00025)) {
//         value -= 0.00025;
//       }
//       deviceId.push(dhcDID);
//       amountList.push(value.toString());
//     }
//   }
//   console.log('amountList', amountList);
//   try {
//     const data = await $api.stakeDoPost({
//       deviceId,
//       amount: amountList,
//       hash: auth.value.hash,
//       data: auth.value.checkString,
//     });
//     if (!data) {
//       throw new Error();
//     }
//     // Simulate the transaction
//     await useWallet().simulate(data);
//     const send = async () => {
//       const tx = await useWallet().broadcast(data);
//       await tx.wait();
//     };
//     toast.promise(send(), {
//       loading: t('sendTransaction'),
//       success: (_) => {
//         refreshNuxtData();
//         return t('transactionSuccess');
//       },
//       error: () => t('transactionFail'),
//     });
//     router.back();
//   }
//   catch (error) {
//     if (error instanceof Error) {
//       if (error.message.includes('missing revert data')) {
//         toast.warning(t('fullStaked'));
//         router.back();
//       }
//       else {
//         toast.warning(t('stakeFailed'));
//       }
//     }
//     else {
//       toast.warning(t('stakeFailed'));
//     }
//   }
//   finally {
//     stakeProcessing.value = false;
//   }
}
</script>

<template>
  <div class="card w-full h-full flex flex-col px-[16px] py-[20px]">
    <div class="flex-row items-center justify-center mb-[20px]">
      <div class="flex relative items-center justify-center">
        <h1
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("dhcStaking") }}
        </h1>
      </div>
    </div>
    <div
      class="p-[16px] rounded-[12px] border border-[#D5D5D5] dark:border-[#2E2E2E] bg-[#EEE] dark:bg-[#121212]"
    >
      <div class="flex flex-row justify-between items-center py-[8px]">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          DHC DID:
        </p>
        <p
          class="text-[14px] leading-[16px] text-[#333] dark:text-white overflow-ellipsis"
        >
          <!--          {{ dhcDID?.slice(0, 6) }}...{{ dhcDID?.slice(-6) }} -->
          0x2c00...03fc77
        </p>
      </div>
      <div class="flex flex-row justify-between py-[8px]">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("totalStaking") }}:
        </p>
        <p class="text-[14px] leading-[16px] text-[#333] dark:text-white">
          <!--          {{ formatAmount(formatEther(totalStaking ?? "0")) }} -->
          7,289,388 tBOL
        </p>
      </div>
      <div class="flex flex-row justify-between py-[8px]">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("totalVoters") }}:
        </p>
        <p class="text-[14px] leading-[16px] text-[#333] dark:text-white">
          <!--          {{ totalVoters }} -->
          184
        </p>
      </div>
      <div class="flex flex-row justify-between pt-[0px] items-center">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("annualYield") }}:
        </p>
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
          <!--          <p -->
          <!--            v-if="annualYield" -->
          <!--            class="ms-[5px] text-[14px] leading-[14px] text-[#333] dark:text-white" -->
          <!--          > -->
          <!--            {{ (Number(annualYield) * 100).toFixed(2) }}% -->
          <!--          </p> -->
          <p
            class="ms-[5px] text-[14px] leading-[14px] text-[#333] dark:text-white"
          >
            {{ 31.08 }}%
          </p>
        </div>
      </div>
    </div>
    <div
      class="mt-[16px] mb-[30px] p-[16px] flex flex-col rounded-[12px] border border-[#D5D5D5] dark:border-[#2E2E2E] bg-[#EEE] dark:bg-[#121212]"
    >
      <div class="flex flex-row justify-between">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("myStaking") }}:
        </p>
        <p class="font-normal text-[14px] leading-[16px] text-primary-500">
          <!--          {{ formatAmount(formatEther(currentStaking ?? "0"), 2) }} tBOL -->
          50,000.01 tBOL
        </p>
      </div>
      <div class="mt-[16px] flex flex-row justify-between">
        <p
          class="text-[14px] font-semibold leading-[16px] text-[#333] dark:text-white"
        >
          {{ t("availableBalance") }}:
        </p>
        <p class="font-normal text-[14px] leading-[16px] text-primary-500">
          <!--          {{ formatAmount(availableBalance ?? "0", 2) }} tBOL -->
          1,456.57 tBOL
        </p>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <h1
        class="text-[16px] leading-none text-[#333] dark:text-white"
      >
        {{ t("updateStaking") }}
        <span
          :padded="false"
          class="ml-2 text-[12px] text-primary-500"
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
    <!--    <UInput -->
    <!--      v-if="!removeStake" -->
    <!--      v-model="amountField" -->
    <!--      v-number="{ -->
    <!--        decimal: '.', -->
    <!--        separator: ',', -->
    <!--        prefix: '', -->
    <!--        precision: 2, -->
    <!--        min: '0', -->
    <!--      }" -->
    <!--      color="white" -->
    <!--      :ui="{ -->
    <!--        rounded: 'rounded-[6px]', -->
    <!--        color: { -->
    <!--          white: { -->
    <!--            outline: -->
    <!--              'dark:bg-white bg-white dark:text-black  text-black ring-0', -->
    <!--          }, -->
    <!--        }, -->
    <!--      }" -->
    <!--      :placeholder="t('numOfTBOLAtLeastHint', { num: 200 })" -->
    <!--      :disabled="query.allowVote === 'false'" -->
    <!--      class="mt-[8px]" -->
    <!--    /> -->
    <UInput
      v-if="!removeStake"
      v-model="amountField"
      v-number="{
        decimal: '.',
        separator: ',',
        prefix: '',
        precision: 2,
        min: '0',
      }"
      color="white"
      :ui="{
        rounded: 'rounded-[6px]',
        color: {
          white: {
            outline:
              'dark:bg-white bg-white dark:text-black  text-black ring-0',
          },
        },
      }"
      :placeholder="t('mustBiggerTanNumOfTBOL', { num: 200 })"
      class="mt-[8px]"
    />
    <div
      v-else
      class="mt-[8px] flex flex-row bg-[#F5F5F5] ring-1 ring-inset ring-[#C4C4C4] rounded-[8px] px-[16px] py-[10px] text-[14px] leading-[16px] text-[#999]"
    >
      <IconDisable class="me-[8px]" />
      {{ t("unstakeTheDHC") }}
    </div>
    <!--    <div -->
    <!--      v-if="query.allowVote === 'false' || removeStake" -->
    <!--      class="mt-[8px] flex items-center" -->
    <!--    > -->
    <!--      <NuxtImg -->
    <!--        src="images/info_icon.png" -->
    <!--        densities="1x 2x" -->
    <!--        width="16" -->
    <!--        height="16" -->
    <!--      /> -->
    <!--      <p class="mx-[6px] text-[12px] text-[#999] dark:text-white"> -->
    <!--        {{ t(removeStake ? 'unstakeHint' : 'votedNodeHasClosed') }} -->
    <!--      </p> -->
    <!--    </div> -->
    <div
      v-if="removeStake"
      class="mt-[8px] flex items-center"
    >
      <NuxtImg
        src="images/info_icon.png"
        densities="1x 2x"
        width="16"
        height="16"
      />
      <p class="mx-[6px] text-[12px] text-[#999] dark:text-white">
        {{ t(removeStake ? 'unstakeHint' : 'votedNodeHasClosed') }}
      </p>
    </div>
    <div class="grow" />
    <div class="mt-[83px] mb-[20px] flex justify-center space-x-[34px]">
      <UButton
        class="justify-center text-[16px] text-[#999] border-[#999] leading-none py-[10px] h-[43px] min-w-[190px]"
        color="black"
        variant="outline"
        :ui="{ rounded: 'rounded-full' }"
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
        :loading="stakeProcessing"
        :ui="{ rounded: 'rounded-full' }"
        class="justify-center text-[16px] leading-[16px] py-[10px] h-[43px] min-w-[190px]"
        @click="confirmBtnOnTap"
      >
        {{ t("confirm") }}
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
