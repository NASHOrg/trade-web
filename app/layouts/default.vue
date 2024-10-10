<script setup lang="ts"></script>

<template>
  <div class="w-full min-h-screen flex flex-col pt-[90px] overflow-hidden">
    <NuxtLoadingIndicator color="#FF7800FF" />
    <LayoutHeader />
    <div class="w-full grow lg:bg-[url('images/background_lg.png')] lg:bg-no-repeat bg-fixed">
      <slot />
    </div>
  </div>
</template>
