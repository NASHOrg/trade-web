<script lang="ts" setup>
import { Toaster } from 'vue-sonner';
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
