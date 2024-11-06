<script lang="ts" setup>
import { Toaster } from 'vue-sonner';
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster
      position="top-center"
      rich-colors
    />
    <UModals />
    <USlideovers />
  </div>
</template>
