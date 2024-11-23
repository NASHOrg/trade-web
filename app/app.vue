<script lang="ts" setup>
import { Toaster } from 'vue-sonner';

const colorMode = useColorMode();
colorMode.value = 'dark';
const { metadata } = useAppConfig();
useHead({
  title: metadata.name,
  meta: [
    { name: 'description', content: metadata.description },
  ],
});

useSeoMeta({
  title: metadata.name,
  description: metadata.description,
  ogTitle: metadata.name,
  ogDescription: metadata.description,
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UModals />
    <USlideovers />
    <Toaster
      position="bottom-right"
      rich-colors
      theme="dark"
      expand
    />
  </div>
</template>
