<script setup lang="ts"></script>

<template>
  <div class="w-full min-h-screen flex flex-col pt-[80px] bg-[url('images/background_lg.png')] bg-no-repeat bg-cover bg-fixed items-center">
    <NuxtLoadingIndicator color="#FF7800FF" />
    <LayoutHeader />
    <div class="w-[600px]">
      <slot />
    </div>
  </div>
</template>
