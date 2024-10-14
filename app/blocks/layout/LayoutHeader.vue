<script setup lang="ts">
const { t } = useI18n();
const userStore = useUserStore();

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
      <div
        v-if="userStore.user"
        class="flex border rounded-[8px] p-[8px] space-x-[8px] bg-transparent"
      >
        <NuxtImg
          src="images/bool_circle_fill_black.png"
          densities="1x 2x"
          height="32"
          width="32"
        />
        <div class="flex flex-col text-[18px] space-y-[4px]">
          <p>{{ shortAddress(user?.userAddress) }}</p>
          <p class="text-[#999] text-[14px]">
            Balance: 30.134544 BOOL
          </p>
        </div>
      </div>
      <ConnectWalletButton v-else />
    </div>
  </div>
</template>
