<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const { token, user } = useUserStore();

const navigations = ['dashboard', 'delegate', 'stake', 'trade', 'invite', 'account'];

const hoveringOnLangSettingsBtn = ref<boolean>(false);
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
      <a
        v-for="item in navigations"
        :key="item"
        :href="`/${item}`"
        :class="{ 'text-primary-500': route.path === `/${item}` }"
      >
        {{ t(item) }}
      </a>
    </div>
    <div class="absolute right-[26px] flex items-center space-x-[16px]">
      <a
        href="/select-language"
        @mouseover="hoveringOnLangSettingsBtn = true"
        @mouseleave="hoveringOnLangSettingsBtn = false"
      >
        <NuxtImg
          :src="`images/icon_globe_${hoveringOnLangSettingsBtn ? 'primary':'white'}.png`"
          densities="1x 2x"
          width="24"
          height="24"
        />
      </a>
      <div
        v-if="token"
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
