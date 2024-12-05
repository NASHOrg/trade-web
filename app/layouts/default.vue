<script setup lang="ts">
const { $config } = useNuxtApp();
const { pairList } = useNetworkConfig();
await callOnce(async () => {
  const data = await $fetch(`${$config.public.baseUrl}/blockchain/pairs`, {
    headers: {
      'Cache-Control': 'max-age=60',
    },
  }) as any;
  pairList.value = data!.data;
});
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col bg-no-repeat bg-cover bg-fixed items-center"
  >
    <NuxtLoadingIndicator color="#FF7800FF" />
    <LayoutHeader />
    <div class="w-full grow flex flex-col">
      <slot />
    </div>
  </div>
</template>
