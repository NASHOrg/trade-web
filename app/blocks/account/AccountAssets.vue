<script setup lang="ts">
import { formatAmount } from '../../utils/helpers';

const { t } = useI18n();
const { $api } = useNuxtApp();
const { bool, usdt } = useNetworkConfig();
const { address } = useWallet();

const { user, token } = useUserStore();

const { data: teamData } = useAsyncData(
  `power-single-team`,
  () => {
    if (!token) return Promise.resolve(undefined);
    return $api.powerSingle({ address: user!.userAddress, type: '0' }, token);
  },
);

const { data: personalData } = useAsyncData(
  'power-single-self',
  () => {
    if (!token) return Promise.resolve(undefined);
    return $api.powerSingle({ address: user!.userAddress, type: '1' }, token);
  },
);
</script>

<template>
  <div class="card p-[30px] my-[28px]">
    <div class="flex justify-between text-[24px]">
      <p>Assets</p>
      <p>Balance</p>
      <p>Entry</p>
    </div>
    <div class="mt-[10px] flex flex-col divide-y divide-[#2E2E2E]">
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            :src="bool.icon"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>{{ bool.symbol }}</p>
            <div class="border border-primary-500 rounded-[2px] p-[3px] text-primary-500 text-[12px]">
              {{ t('token') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-[8px]">
          <p class="text-primary-500 text-[20px]">
            <TokenBalance
              :token="bool"
              :address="address"
            />
          </p>
          <p class="text-[16px] text-[#999]">
            $1020.02
          </p>
        </div>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          to="/trade"
        >
          {{ t('swap') }}
        </UButton>
      </div>
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            :src="usdt.icon"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>{{ usdt.symbol }}</p>
            <div class="border border-primary-500 rounded-[2px] p-[3px] text-primary-500 text-[12px]">
              {{ t('token') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end space-y-[8px]">
          <p class="text-primary-500 text-[20px]">
            <TokenBalance
              :token="usdt"
              :address="address"
            />
          </p>
          <p class="text-[16px] text-[#999]">
            $1000.15
          </p>
        </div>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          to="https://test.hellobtu.com/borrow"
          target="_blank"
        >
          {{ t('swap') }}
        </UButton>
      </div>
      <div class="py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/btp_circle_fill_red.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BTP</p>
            <div class="border border-[#38C15A] rounded-[2px] p-[3px] text-[#38C15A] text-[12px]">
              {{ t('power') }}
            </div>
          </div>
        </div>
        <p class="text-primary-500 text-[20px]">
          {{ formatAmount(teamData?.power ?? '0', 2) }}
        </p>
        <UButton
          color="black"
          class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]"
          to="/stake"
        >
          {{ t('stake') }}
        </UButton>
      </div>
      <div class="relative py-[20px] flex justify-between items-center">
        <div class="flex">
          <NuxtImg
            src="images/bpp_circle_fill_grey.png"
            densities="1x 2x"
            height="50"
            width="50"
          />
          <div class="flex flex-col justify-center ms-[8px] space-y-[6px]">
            <p>BPP</p>
            <div class="border border-[#38C15A] rounded-[2px] p-[3px] text-[#38C15A] text-[12px]">
              {{ t('power') }}
            </div>
          </div>
        </div>
        <p class="text-primary-500 text-[20px]">
          {{ formatAmount(personalData?.power ?? '0', 2) }}
        </p>
        <div class="w-[72px]" />
        <div class="absolute -end-0 flex space-x-[8px]">
          <!--          <UButton -->
          <!--            color="black" -->
          <!--            class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]" -->
          <!--            @click="bppListBtnOnTap" -->
          <!--          > -->
          <!--            {{ t('list') }} -->
          <!--          </UButton> -->
          <!--          <UButton -->
          <!--            color="primary" -->
          <!--            class="p-[6px] min-w-[72px] justify-center text-[16px] rounded-[4px]" -->
          <!--            @click="bppOfferBtnOnTap" -->
          <!--          > -->
          <!--            {{ t('offer') }} -->
          <!--          </UButton> -->
        </div>
      </div>
    </div>
  </div>
</template>
