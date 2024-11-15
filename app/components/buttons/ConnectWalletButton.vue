<script setup lang="ts">
const { open, address } = useWallet();
const { $localePath } = useNuxtApp();
const router = useRouter();
const { disconnect } = useWallet();

const options = computed(() => {
  return [
    [
      {
        label: 'Account',
        icon: 'i-icon-park-outline-data',
        click: () => {
          router.push($localePath({ path: '/account' }));
        },
      },
    ],
    [
      {
        label: 'Disconnect',
        icon: 'i-material-symbols-logout',
        click: () => {
          disconnect();
        },
      },
    ],
  ];
});
</script>

<template>
  <div>
    <UDropdown
      v-if="address"
      :items="options"
      :popper="{ placement: 'bottom-start' }"
    >
      <div
        class="flex border-[1px] border-primary rounded-[4px] px-[8px] py-[6px] space-x-[8px] bg-transparent cursor-pointer items-center"
      >
        <NuxtPicture
          src="https://bool.network/bool-network-orange.png"
          densities="1x 2x"
          height="18"
          width="18"
          class="rounded-full overflow-hidden"
        />
        <div class="flex items-center text-xs leading-none">
          <p>{{ shortAddress(address, 4) }}</p>
          <UIcon
            name="i-icon-park-solid-down-one"
            class="left-[2px] bg-[#999999]"
          />
        </div>
      </div>
    </UDropdown>

    <UButton
      v-else
      class="h-[30px] text-sm leading-6 font-normal px-[10px]"
      :ui="{ rounded: 'rounded-[4px]' }"
      @click="open"
    >
      {{ $t("connect") }}
    </UButton>
  </div>
</template>
