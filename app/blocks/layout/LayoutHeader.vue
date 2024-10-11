<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();

const navigations = ['dashboard', 'delegate', 'stake', 'trade', 'invite', 'account'];

function languageBtnOnTap() {

}
</script>

<template>
  <div class="fixed top-0 flex justify-between w-full h-[80px] bg-[#0E0E0E] p-[26px]">
    <a href="/">
      <NuxtImg
        src="images/bool_network_white.png"
        densities="1x 2x"
        height="27"
        width="70"
      />
    </a>
    <div class="flex space-x-[40px] items-center">
      <a
        v-for="item in navigations"
        :key="item"
        :href="`/${item}`"
        :class="{ 'text-primary': route.path === `/${item}` }"
      >
        {{ t(item) }}
      </a>
    </div>
    <button @click="languageBtnOnTap">
      <NuxtImg
        src="images/icon_globe_white.png"
        densities="1x 2x"
        width="24"
        height="24"
      />
    </button>
  </div>
</template>
