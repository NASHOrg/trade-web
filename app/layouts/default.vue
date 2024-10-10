<script setup lang="ts"></script>

<template>
  <div class="w-full min-h-screen flex flex-col pt-[90px] overflow-hidden">
    <NuxtLoadingIndicator color="#FF7800FF" />
    <LayoutHeader />
    <div class="w-full grow flex flex-col">
      <slot />
    </div>
    <LayoutFooter />
  </div>
</template>
