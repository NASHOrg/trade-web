<script setup lang="ts">
import StakeStat from '~/blocks/stake/StakeStat.vue';
import DHCNodesList from '~/blocks/stake/DHCNodesList.vue';

const accountInfos = ref<{
  myRewards: string;
  myBalance: string;
  releaseBalance: string;
  staking?: { [key: string]: string };
  unstaked: string;
  incommingUnstaked: string;
} | null>({
  myBalance: '300.13',
  releaseBalance: '500',
  myRewards: '8390000000000000000',
  unstaked: '50.00',
  incommingUnstaked: '100',
});
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <StakeStat v-model:value="accountInfos" />
    <DHCNodesList :account-infos="accountInfos" />
  </div>
</template>
