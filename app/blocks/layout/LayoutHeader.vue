<script setup lang="ts">
const { t } = useI18n();

const navigations = ['dashboard', 'delegate', 'stake', 'trade', 'invite', 'account'];
</script>

<template>
  <div class="fixed top-0 flex justify-center items-center w-full bg-[#0E0E0E] h-[80px] z-10">
    <a
      href="/"
      class="absolute left-[26px]"
    >
      <NuxtImg
        src="images/bool_network_white.png"
        densities="1x 2x"
        height="27"
        width="70"
      />
    </a>
    <div class="flex space-x-[40px] items-center">
      <ULink
        v-for="item in navigations"
        :key="item"
        :to="item"
        active-class="text-primary"
      >
        {{ t(item) }}
      </ULink>
    </div>
    <div class="absolute right-[26px] flex items-center space-x-[16px]">
      <ULink
        to="/language"
        class="text-white hover:text-primary"
      >
        <IconLanguage />
      </ULink>
      <ConnectWalletButton />
    </div>
  </div>
</template>
