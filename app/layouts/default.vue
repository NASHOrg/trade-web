<script setup lang="ts">
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img('images/background_lg.png');
  return { backgroundImage: `url('${imgUrl}')` };
});
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col bg-no-repeat bg-cover bg-fixed items-center"
    :style="backgroundStyles"
  >
    <NuxtLoadingIndicator color="#FF7800FF" />
    <LayoutHeader />
    <div class="w-[600px] mt-[40px]">
      <slot />
    </div>
  </div>
</template>
