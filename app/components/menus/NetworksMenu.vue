<script lang="ts" setup>
const { $yapi } = useNuxtApp();
const userStore = useUserStore();
const { networks, changeNetwork } = userStore;
const currentNetwork = computed(() => {
  return userStore.currentNetwork;
});

const items = computed(() => {
  return networks.map((item) => {
    return [
      {
        label: item.name,
        click: () => {
          $yapi.setBaseUrl(item.baseUrl);
          changeNetwork(item);
          refreshNuxtData();
        },
      },
    ];
  });
});
</script>

<template>
  <UDropdown
    :items="items"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="white"
      :label="currentNetwork.name"
      size="sm"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </UDropdown>
</template>

<style scoped lang="scss"></style>
