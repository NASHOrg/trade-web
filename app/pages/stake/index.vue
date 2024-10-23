<script setup lang="ts">
import type { AccountInfo } from '~/types/common';

const { t } = useI18n();
const accountInfo = ref<AccountInfo | undefined>();

const tabs = [
  { value: 'crowdfund', label: t('crowdfundingNodes') },
  { value: 'mine', label: t('miningNodes') },
] as const;
const selectedTab = ref<'mine' | 'crowdfund'>('crowdfund');
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <StakeStat @update="(value: any) => accountInfo = value" />
    <div class="my-[28px] card w-full flex flex-col p-[30px]">
      <div class="flex justify-around text-[28px] text-[#999]">
        <h1
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="selectedTab === item.value ?'text-primary-500':''"
          @click="selectedTab = item.value"
        >
          {{ item.label }}
        </h1>
      </div>
      <DHCNodesList
        v-if="selectedTab === 'mine'"
        :account-info="accountInfo"
        type="mine"
      />
      <DHCNodesList
        v-else
        :account-info="accountInfo"
        type="crowdfund"
      />
    </div>
  </div>
</template>
