<script lang="ts" setup>
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster
      position="bottom-right"
      rich-colors
      theme="dark"
    />
    <UModals />
    <USlideovers />
  </div>
</template>
