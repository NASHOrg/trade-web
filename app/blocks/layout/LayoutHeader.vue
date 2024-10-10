<script setup lang="ts">
const links = [
  {
    id: 'explorer',
    label: 'EXPLORER',
    url: 'https://beta-testnet.boolscan.com',
  },
  { id: 'bridge', label: 'BRIDGE', url: 'https://boolbridge.com' },
  {
    id: 'dhc',
    label: 'DHC',
    url: 'https://beta-testnet.boolscan.com/dhcs',
  },
];
const showMenu = ref(false);
const isLocked = useScrollLock(document);
function toggleMenu() {
  showMenu.value = !showMenu.value;
  isLocked.value = showMenu.value;
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-[90px] bg-gray-900 z-50 backdrop-blur">
    <a
      href="https://bool.network"
      target="_self"
    >
      <IconBool
        class="h-[29px] w-fit absolute top-[30px] left-[30px] md:left-[110px] sm:left-[15px]"
      />
    </a>
    <div
      class="absolute right-[15px] md:right-[110px] top-[25px] text-neutral-content flex flex-row text-[18px] font-bold items-center"
    >
      <a
        href="/"
        target="_self"
        class="px-[8px] text-primary hover:underline hidden md:block"
      >CAMPAIGN</a>
      <div
        v-for="link in links"
        :key="link.id"
        class="hidden md:block"
      >
        <a
          :href="link.url"
          target="_blank"
          class="px-[8px] text-white hover:text-primary hover:underline"
        >{{ link.label }}</a>
      </div>
      <ThemeModeButton />
      <div class="min-w-[100px] min-h-[40px] ml-2 flex flex-row items-center">
        <ConnectWalletButton />
      </div>
      <div
        class="w-5 h-5 block md:hidden relative text-white mx-2"
        @click="toggleMenu"
      >
        <div
          class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <span
            aria-hidden="true"
            class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
            :class="{ 'rotate-45': showMenu, ' -translate-y-1.5': !showMenu }"
          />
          <span
            aria-hidden="true"
            class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
            :class="{ 'opacity-0': showMenu }"
          />
          <span
            aria-hidden="true"
            class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
            :class="{ '-rotate-45': showMenu, ' translate-y-1.5': !showMenu }"
          />
        </div>
      </div>
    </div>
    <div
      v-if="showMenu"
      class="bg-gray-900 transition-opacity fixed top-[80px] w-full h-full bg-neutral z-50 flex flex-col pt-[60px] font-bold items-center space-y-5"
    >
      <div
        v-for="link in links"
        :key="link.id"
      >
        <a
          :href="link.url"
          target="_blank"
          class="px-[8px] text-white hover:text-primary hover:underline"
        >{{ link.label }}</a>
      </div>
    </div>
  </div>
</template>
