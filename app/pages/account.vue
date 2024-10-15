<script setup lang="ts">
import AccountStat from '~/blocks/account/AccountStat.vue';
import AccountAssets from '~/blocks/account/AccountAssets.vue';

const statMode = ref<'team' | 'personal'>('team');
</script>

<template>
  <div class="flex flex-col">
    <AccountStat
      :mode="statMode"
      @switch="statMode = (statMode === 'team' ? 'personal' : 'team')"
    />
    <AccountAssets />
  </div>
</template>

<style scoped lang="postcss">

</style>
