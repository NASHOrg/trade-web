<script setup lang="ts">
// const img = useImage();
// const backgroundStyles = computed(() => {
//   const imgUrl = img('images/background_lg.png');
//   return { backgroundImage: `url('${imgUrl}')` };
// });
const mode = useColorMode();
const { $api } = useNuxtApp();
const { pairList } = useNetworkConfig();
await callOnce(async () => {
  const data = await $api.blockchainPairs({});
  pairList.value = data!;
});

mode.value = 'dark';
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
