<script setup lang="ts">
import { toast } from 'vue-sonner';
import { formatEther } from 'ethers';

const { t } = useI18n();

const data = reactive({
  myBalance: '300.13',
  releaseBalance: '500',
  myRewards: '8390000000000000000',
  unstaked: '50.00',
  incommingUnstaked: '100',
});

const totalStaking = {
  total: '50,000.01',
  pending: '+400',
};

const retrieveProcessing = ref(false);
const retrieveBtnOnTap = async () => {
  retrieveProcessing.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  retrieveProcessing.value = false;
};
</script>

<template>
  <table
    id="statTable"
  >
    <tbody>
      <tr>
        <td class="flex items-start justify-start">
          <!--            <IconCoinsBalance v-if="isLight" /> -->
          <IconCoinsBalanceDark />
          <div class="ms-[8px] flex flex-col">
            <p>{{ t('balance') }}</p>
            <!--              <USkeleton -->
            <!--                v-if="status === 'pending' || !data" -->
            <!--                class="mt-[10px] h-[16px] w-[80px]" -->
            <!--              /> -->
            <p
              class="mt-[10px] text-[16px]"
            >
              <span class="text-primary-500">{{ formatAmount(data.myBalance ?? "0", 2) }}</span>
              <span v-if="data.releaseBalance && Number(data.releaseBalance) !== 0"> / </span>
              <span
                v-if="data.releaseBalance && Number(data.releaseBalance) !== 0"
                class="text-[#0AC491]"
              >
                {{ Number(data.releaseBalance) >= 0 ? '+' : '-' }}{{ formatAmount(data.releaseBalance, 2) }}
              </span>
            </p>
          </div>
        </td>
        <td
          rowspan="2"
          class="relative w-1/2 border-s border-[#EAEAEA] dark:border-[#2E2E2E]"
        >
          <NuxtImg
            class="absolute top-[20px] end-[16px] cursor-pointer"
            src="images/info_icon.png"
            densities="1x 2x"
            width="16"
            height="16"
            @click="toast.info(t('stakeTip'))"
          />
          <!--            <IconCoinsRewards v-if="isLight" /> -->
          <IconCoinsRewardsDark />
          <p class="mt-[8px] text-[18px] leading-[20px]">
            {{ t('totalRewards') }}
          </p>
          <!--            <USkeleton -->
          <!--              v-if="status === 'pending' || !data" -->
          <!--              class="mt-[16px] h-[20px] w-[80px]" -->
          <!--            /> -->
          <p
            class="mt-[16px] text-primary-500 text-[20px]"
          >
            {{ formatAmount(formatEther(data!.myRewards), 4) }} tBOL
          </p>
        </td>
      </tr>
      <tr>
        <td class="flex items-start justify-start">
          <!--            <IconCoinsStaking v-if="isLight" /> -->
          <IconCoinsStakingDark />
          <div
            class="ms-[8px] flex flex-col"
          >
            <p>{{ t('staking') }}</p>
            <!--              <USkeleton -->
            <!--                v-if="status === 'pending' || !data" -->
            <!--                class="mt-[10px] h-[16px] w-[80px]" -->
            <!--              /> -->
            <p
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
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="flex justify-between items-center">
            <div class="flex items-start justify-start">
              <!--                <IconDocumentSearch v-if="isLight" /> -->
              <IconDocumentSearchDark />
              <div
                class="ms-[8px] flex flex-col text-[16px]"
              >
                <p>{{ t('unstaked') }}</p>
                <!--                  <USkeleton -->
                <!--                    v-if="status === 'pending' || !data" -->
                <!--                    class="mt-[10px] h-[16px] w-[80px]" -->
                <!--                  /> -->
                <p
                  class="mt-[10px]"
                >
                  <span class="text-primary-500">{{ data.unstaked }}</span>
                  <span v-if="data.incommingUnstaked !== '0'"> / </span>
                  <span
                    v-if="data.incommingUnstaked !== '0'"
                    class="text-[#0AC491]"
                  >{{ `+${data.incommingUnstaked}` }}</span>
                </p>
              </div>
            </div>
            <UButton
              :ui="{ rounded: 'rounded-full', color: { primary: 'dark:bg-primary-500' } }"
              class="px-[10px] py-[7px]"
              :loading="retrieveProcessing"
              :disabled="Number(data?.unstaked) === 0"
              @click="retrieveBtnOnTap"
            >
              {{ t(retrieveProcessing ? 'retrieving' : 'retrieve') }}
            </UButton>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="postcss">
#statTable {
  @apply text-[#333] dark:text-white;
  width: 100%;

  font-size: 16px;
  line-height: 1;

  tr {
    @apply dark:border-[#2E2E2E];
    border: 1px solid #EAEAEA;
  }

  td {
    padding: 14px 16px;
  }
}
</style>
