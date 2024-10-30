<script setup lang="ts">
import { formatAmount } from '~/utils/helpers';

const { t } = useI18n();

const selectedPoolTab = ref<'public' | 'super' | 'vip'>('public');
const availableFilter = ref<boolean>(false);

const publicPools = [
  {
    address: '0x87aa...efbee3',
    progress: 38.56,
    agencyId: 'P3',
    totalPackage: '1000000.00',
    remainingCapacity: '614396.43',
    totalDelegators: 248,
    expectedYield: '1% - 5%',
    minimumThreshold: '0',
    delegationLimit: '2000',
    myDelegated: '1000',
  },
];
</script>

<template>
  <div class="relative card w-full flex flex-col px-[30px] py-[18px]">
    <h2>{{ t('poolList') }}</h2>
    <button class="absolute top-[22px] right-[30px]">
      <NuxtImg
        src="images/icon_info_circle_grey.png"
        densities="1x 2x"
        height="16"
        width="16"
      />
    </button>
    <div class="mt-[20px] flex justify-between">
      <div class="flex space-x-[8px]">
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="{ 'border-transparent text-[#999]': selectedPoolTab !== 'public' }"
          @click="selectedPoolTab = 'public'"
        >
          {{ t('public') }}
        </button>
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="{ 'border-transparent text-[#999]': selectedPoolTab !== 'super' }"
          @click="selectedPoolTab = 'super'"
        >
          {{ t('super') }}
        </button>
        <button
          class="rounded-full px-[8px] py-[6px] border"
          :class="{ 'border-transparent text-[#999]': selectedPoolTab !== 'vip' }"
          @click="selectedPoolTab = 'vip'"
        >
          {{ t('vip') }}
        </button>
      </div>
      <div class="flex items-center justify-center">
        <p class="font-[16px] text-[#999] me-[8px]">
          {{ t("availableOnly") }}
        </p>
        <ClientOnly>
          <UToggle v-model="availableFilter" />
        </ClientOnly>
      </div>
    </div>
    <div class="mt-[16px] flex flex-col">
      <div
        v-for="item in publicPools"
        :key="item.agencyId"
        class="border rounded-[6px] flex flex-col divide-y divide-[#2E2E2E] px-[16px] py-[4px]"
      >
        <div class="flex items-center py-[20px]">
          <p class="flex-grow">
            {{ '0x87aa...efbee3' }}
          </p>
          <div class="flex items-center space-x-[8px]">
            <UProgress
              :value="item.progress"
              class="w-[176px]"
            />
            <span v-if="item.progress === 100">FULL</span>
            <span v-else>{{ item.progress }} %</span>
          </div>
        </div>
        <div class="flex flex-col py-[20px] space-y-[16px]">
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('agencyId') }}:
            </p>
            <p>{{ item.agencyId }}</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('totalPackage') }}:
            </p>
            <p>{{ formatAmount(item.totalPackage) }} BPP</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('remainingCapacity') }}:
            </p>
            <p>{{ formatAmount(item.remainingCapacity) }} BPP</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('totalDelegators') }}:
            </p>
            <p>{{ item.totalDelegators }}</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('expectedYield') }}:
            </p>
            <p>{{ item.expectedYield }}</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('minimumThreshold') }}:
            </p>
            <p>{{ formatAmount(item.minimumThreshold) }} BPP</p>
          </div>
          <div class="flex justify-between">
            <p class="text-white/80">
              {{ t('delegationLimit') }}:
            </p>
            <p>{{ formatAmount(item.delegationLimit) }} BPP</p>
          </div>
        </div>
        <div class="py-[20px] space-y-[16px]">
          <div class="flex justify-between">
            <p>{{ t('myDelegated') }}:</p>
            <span class="text-primary-500">{{ formatAmount(item.myDelegated) }} BPP</span>
          </div>
          <div class="flex space-x-[16px]">
            <UInput
              size="xl"
              class="grow"
            />
            <UButton
              class="rounded-[6px] p-[10px] text-[18px]"
            >
              {{ t('delegate') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
