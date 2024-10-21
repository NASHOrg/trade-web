<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();

const navigations = [
  {
    id: 'dashboard',
    href: '/dashboard',
    label: t('dashboard'),
  },
  {
    id: 'stake',
    href: '/stake',
    label: t('stake'),
  },
  {
    id: 'trade',
    href: '/trade',
    label: t('trade'),
  },
  {
    id: 'invite',
    href: '/invite',
    label: t('invite'),
  },
  {
    id: 'account',
    href: '/account',
    label: t('account'),
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
  <div class="sticky top-0 flex justify-center items-center w-full bg-[#0E0E0E]/10 h-[80px] z-10 backdrop-blur">
    <IconBool
      class="absolute left-[26px]"
    />
    <div class="hidden lg:flex space-x-[40px] items-center text-[20px]">
      <ULink
        v-for="item in navigations"
        :key="item.id"
        :to="item.href"
        active-class="text-primary"
        :exact="false"
      >
        {{ item.label }}
      </ULink>
    </div>
    <div class="absolute right-[26px] flex items-center space-x-[16px]">
      <!--      <ULink -->
      <!--        to="/language" -->
      <!--        class="text-white hover:text-primary" -->
      <!--      > -->
      <!--        <IconLanguage /> -->
      <!--      </ULink> -->
      <ConnectWalletButton />
      <div
        class="w-5 h-5 block lg:hidden relative text-white mx-2 cursor-pointer"
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
      class="transition-opacity px-[20px] text-[24px] fixed top-[80px] w-full min-h-screen bg-black z-50 flex flex-col pt-[60px] font-bold items-start space-y-5"
    >
      <ULink
        v-for="item in navigations"
        :key="item.id"
        :to="item.href"
        active-class="text-primary"
        @click.prevent="() => { toggleMenu(); router.push(item.href) }"
      >
        {{ item.label }}
      </ULink>
    </div>
  </div>
</template>
